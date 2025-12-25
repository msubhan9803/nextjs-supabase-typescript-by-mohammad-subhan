import { useMutation } from '@tanstack/react-query';
import type { SendEmailInput } from '@/lib/validations/email';

interface SendEmailResponse {
  results: Array<{
    success: boolean;
    recipient: string;
    error?: string;
  }>;
}

async function sendEmails(input: SendEmailInput): Promise<SendEmailResponse> {
  const response = await fetch('/api/emails/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send emails');
  }
  return response.json();
}

export function useSendEmails() {
  return useMutation({
    mutationFn: sendEmails,
  });
}

