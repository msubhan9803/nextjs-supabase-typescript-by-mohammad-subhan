# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
   - Enable Google provider in Authentication > Providers
   - Configure Google OAuth with required scopes

3. **Set up Google Cloud:**
   - Create/select a project
   - Enable Calendar API and Gmail API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add redirect URIs

4. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Google credentials

5. **Run the application:**
   ```bash
   pnpm dev
   ```

## Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- See supabase/migrations/001_initial_schema.sql
```

This creates:
- `clients` table
- `google_tokens` table
- `email_templates` table
- RLS policies
- Indexes
- Triggers

## Google OAuth Configuration

### Required Scopes:
- `https://www.googleapis.com/auth/calendar.readonly`
- `https://www.googleapis.com/auth/gmail.send`

### Redirect URIs:
- `https://<your-project-ref>.supabase.co/auth/v1/callback`
- `http://localhost:3000/api/auth/callback` (for development)

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### "Google tokens not found"
- Ensure you've logged in with Google
- Check that OAuth scopes are correctly configured
- Verify tokens are being stored in the database

### "Failed to refresh token"
- Check that refresh_token is stored correctly
- Verify token expiration handling

### Database errors
- Ensure migration SQL has been run
- Check RLS policies are enabled
- Verify user authentication

