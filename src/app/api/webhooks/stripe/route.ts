export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const SUPABASE_URL = 'https://ftkpqjcwsuvrbaoexcxz.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0a3BxamN3c3V2cmJhb2V4Y3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTU2MjQsImV4cCI6MjA5NTczMTYyNH0.AlzI9AtVjN_eOQjCCAnF79pjWDa8MzR1SgCHS54go6k'
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0a3BxamN3c3V2cmJhb2V4Y3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE1NTYyNCwiZXhwIjoyMDk1NzMxNjI0fQ.0BIcvCAcl3KCQdKOZ53iDfRbaVteoxxSVRYsBbW34JU'

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_PSP_WEBHOOK_SECRET

  if (!stripeSecretKey || !webhookSecret) {
    console.error('[psp-webhook] Missing STRIPE_SECRET_KEY or STRIPE_PSP_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('[psp-webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email || session.customer_details?.email

    if (!email) {
      console.error('[psp-webhook] No email on session:', event.id)
      return NextResponse.json({ received: true })
    }

    console.log('[psp-webhook] Processing standalone purchase for:', email)

    // 1. Check if user already exists
    const existingUsersRes = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
      }
    )

    let userId: string | null = null

    if (existingUsersRes.ok) {
      const usersData = await existingUsersRes.json()
      const users = usersData?.users || []
      if (users.length > 0) {
        userId = users[0].id
        console.log('[psp-webhook] Existing user found:', userId)
      }
    }

    // 2. Create user if they don't exist (sends invite email to set password)
    if (!userId) {
      const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/generateLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          type: 'invite',
          email,
          options: {
            redirect_to: 'https://pipesketchpro.com/api/auth/callback?next=/app',
          },
        }),
      })

      const createData = await createRes.json()
      if (!createRes.ok) {
        console.error('[psp-webhook] Failed to create user:', createData)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      userId = createData?.properties?.hashed_token
        ? null
        : createData?.user?.id || createData?.data?.user?.id

      // Get the user ID by querying profiles by email as fallback
      if (!userId) {
        const lookupRes = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
          }
        )
        const rows = await lookupRes.json()
        if (Array.isArray(rows) && rows[0]?.id) userId = rows[0].id
      }

      console.log('[psp-webhook] New user created, invite email sent to:', email)
    }

    // 3. Ensure profile row exists and set psp_standalone = true
    if (userId) {
      // Upsert profile
      await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ id: userId, email, psp_standalone: true }),
      })
    } else {
      // Fallback: patch by email
      await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ psp_standalone: true }),
        }
      )
    }

    console.log('[psp-webhook] psp_standalone=true set for:', email)
  }

  // Handle subscription cancellation
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    if (customerId) {
      const customerRes = await stripe.customers.retrieve(customerId)
      const customerEmail = (customerRes as Stripe.Customer).email

      if (customerEmail) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(customerEmail)}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ psp_standalone: false }),
          }
        )
        console.log('[psp-webhook] psp_standalone=false on cancellation for:', customerEmail)
      }
    }
  }

  return NextResponse.json({ received: true })
}
