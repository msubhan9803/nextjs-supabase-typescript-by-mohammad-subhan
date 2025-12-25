import { z } from 'zod';

export const sendEmailSchema = z.object({
  clientIds: z.array(z.string().uuid()).min(1, 'At least one client must be selected'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

