# Client Management Application

A full-stack web application for managing clients, synchronizing Google Calendar events, and sending personalized emails via Gmail API.

**Tech Stack:** TypeScript • Next.js App Router • React • Supabase • React Query • Zod • Google APIs

## Features

- ✅ **Google OAuth Authentication** - Secure login with Google
- ✅ **Client Management** - Full CRUD operations for client database
- ✅ **Google Calendar Sync** - View and filter calendar events
- ✅ **Email Sending** - Send personalized emails via Gmail API
- ✅ **Email Templates** - Create and manage email templates with dynamic variables

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- A Supabase account and project
- A Google Cloud project with OAuth credentials

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextjs-supabase-typescript-by-mohammad-subhan
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:
   ```sql
   -- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
   ```
3. Go to **Authentication > Providers** and enable **Google** provider
4. Configure Google OAuth:
   - Add your Google OAuth Client ID and Secret
   - Set redirect URL to: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Add scopes: `https://www.googleapis.com/auth/calendar.readonly` and `https://www.googleapis.com/auth/gmail.send`

### 4. Set Up Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Calendar API
   - Gmail API
4. Configure OAuth consent screen:
   - Choose **External** user type
   - Fill in required information
   - Add scopes:
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/gmail.send`
5. Create OAuth 2.0 credentials:
   - Go to **Credentials** > **Create Credentials** > **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - `http://localhost:3000/api/auth/callback` (for local development)

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

You can find these values in your Supabase project settings:
- **Project URL**: Settings > API > Project URL
- **Anon Key**: Settings > API > Project API keys > `anon` `public`
- **Service Role Key**: Settings > API > Project API keys > `service_role` `secret`

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
├── backend/
│   ├── entities/             # Type definitions
│   ├── repositories/         # Data access layer
│   └── services/            # Business logic layer
├── components/               # React components
├── hooks/                    # React Query hooks
├── lib/                      # Utilities and configurations
│   ├── supabase/            # Supabase clients
│   └── validations/         # Zod schemas
├── types/                    # TypeScript types
└── supabase/
    └── migrations/           # Database migrations
```

## Architecture

The application follows a clean architecture pattern:

- **API Routes** (`app/api/`) - Handle HTTP requests, validation, and responses
- **Services** (`backend/services/`) - Business logic and orchestration
- **Repositories** (`backend/repositories/`) - Data access and database operations
- **Entities** (`backend/entities/`) - Domain models and types

## Key Features Implementation

### Authentication

- Google OAuth via Supabase Auth
- Automatic token storage and refresh
- Route protection via middleware

### Client Management

- Create, read, update, delete clients
- Client-side and server-side validation with Zod
- Ownership verification (users can only access their own clients)

### Calendar Synchronization

- Fetch events from Google Calendar
- Filter by period (today, week, month, custom)
- Automatic token refresh
- Manual refresh button

### Email Sending

- Select multiple clients
- Compose personalized emails
- Support for dynamic variables: `{{client_name}}`, `{{email}}`, `{{date}}`
- Bulk email sending with error handling

### Email Templates

- Create, read, update, delete templates
- Dynamic variable support
- Reusable templates for quick email composition

## Database Schema

### Tables

- `clients` - Client information
- `google_tokens` - OAuth tokens for Google APIs
- `email_templates` - Email templates

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Development

### TypeScript

The project uses strict TypeScript configuration. All types are properly defined with no `any` types.

### Validation

- Client-side validation with Zod schemas
- Server-side validation in API routes
- Clear error messages

### State Management

- React Query for server state
- Optimistic updates for better UX
- Automatic cache invalidation

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Troubleshooting

### Google OAuth Issues

- Ensure redirect URIs are correctly configured in Google Cloud Console
- Check that scopes are properly requested
- Verify Supabase Google provider is enabled

### Token Refresh Issues

- Check that `refresh_token` is being stored correctly
- Ensure token expiration is handled properly

### Database Issues

- Run the migration SQL in Supabase SQL Editor
- Verify RLS policies are created
- Check that indexes are created

## License

This project is part of a technical test.

## Author

Mohammad Subhan
