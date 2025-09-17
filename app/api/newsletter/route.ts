import { NextResponse } from 'next/server'
import { subscribeToNewsletter } from '../../../lib/supabase'

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, interests } = body || {}

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const interestsArray = Array.isArray(interests)
      ? interests.filter((it: unknown) => typeof it === 'string')
      : []

    const data = await subscribeToNewsletter(email, interestsArray)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}


