import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { EmailTemplateService } from '@/backend/services/email-template-service';
import { EmailTemplateRepository } from '@/backend/repositories/email-template-repository';
import { createEmailTemplateSchema } from '@/lib/validations/email-template';

const emailTemplateService = new EmailTemplateService(
  new EmailTemplateRepository()
);

export async function GET() {
  try {
    const user = await requireAuth();
    const templates = await emailTemplateService.getAllTemplates(user.id);
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch email templates',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = createEmailTemplateSchema.parse(body);
    const template = await emailTemplateService.createTemplate(
      validatedData,
      user.id
    );
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    console.error('Error creating email template:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create email template',
      },
      { status: 500 }
    );
  }
}

