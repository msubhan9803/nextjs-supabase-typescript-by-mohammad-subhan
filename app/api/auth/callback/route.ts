import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleTokenRepository } from '@/backend/repositories/google-token-repository';

const googleTokenRepository = new GoogleTokenRepository();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Store Google tokens if available in the session
      const providerToken = data.session.provider_token;
      const providerRefreshToken = data.session.provider_refresh_token;
      const expiresAt = data.session.expires_at
        ? new Date(data.session.expires_at * 1000)
        : new Date(Date.now() + 3600 * 1000);

      if (providerToken && providerRefreshToken) {
        try {
          await googleTokenRepository.upsert({
            user_id: data.session.user.id,
            access_token: providerToken,
            refresh_token: providerRefreshToken,
            expires_at: expiresAt,
          });
        } catch (tokenError) {
          console.error('Error storing Google tokens:', tokenError);
          // Continue even if token storage fails
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
}

