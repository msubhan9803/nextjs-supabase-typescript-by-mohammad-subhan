import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { EmailService } from '@/backend/services/email-service';
import { GoogleTokenRepository } from '@/backend/repositories/google-token-repository';
import { ClientRepository } from '@/backend/repositories/client-repository';
import { sendEmailSchema } from '@/lib/validations/email';

const emailService = new EmailService(
  new GoogleTokenRepository(),
  new ClientRepository()
);

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = sendEmailSchema.parse(body);
    const results = await emailService.sendEmails(user.id, validatedData);
    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send emails' },
      { status: 500 }
    );
  }
}

