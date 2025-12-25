import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { EmailTemplateService } from '@/backend/services/email-template-service';
import { EmailTemplateRepository } from '@/backend/repositories/email-template-repository';
import { updateEmailTemplateSchema } from '@/lib/validations/email-template';

const emailTemplateService = new EmailTemplateService(
  new EmailTemplateRepository()
);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const template = await emailTemplateService.getTemplateById(id, user.id);
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch email template',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateEmailTemplateSchema.parse(body);
    const template = await emailTemplateService.updateTemplate(
      id,
      validatedData,
      user.id
    );
    return NextResponse.json(template);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    console.error('Error updating email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update email template',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    await emailTemplateService.deleteTemplate(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete email template',
      },
      { status: 500 }
    );
  }
}

