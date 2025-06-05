import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/select-roi'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      NextResponse.redirect(new URL(next,baseUrl))
    }
  }

  redirect('/error')
}
