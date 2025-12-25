import { z } from 'zod';

export const getCalendarEventsSchema = z.object({
  timeMin: z.string().datetime().optional(),
  timeMax: z.string().datetime().optional(),
  period: z.enum(['today', 'week', 'month', 'custom']).optional(),
});

export type GetCalendarEventsInput = z.infer<typeof getCalendarEventsSchema>;

