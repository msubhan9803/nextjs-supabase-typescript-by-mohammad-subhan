import { useQuery } from '@tanstack/react-query';
import type { CalendarEvent } from '@/backend/entities/calendar-event';

interface GetCalendarEventsParams {
  period?: 'today' | 'week' | 'month' | 'custom';
  timeMin?: string;
  timeMax?: string;
}

async function fetchCalendarEvents(
  params: GetCalendarEventsParams
): Promise<CalendarEvent[]> {
  const searchParams = new URLSearchParams();
  if (params.period) {
    searchParams.set('period', params.period);
  }
  if (params.timeMin) {
    searchParams.set('timeMin', params.timeMin);
  }
  if (params.timeMax) {
    searchParams.set('timeMax', params.timeMax);
  }

  const response = await fetch(`/api/calendar/events?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }
  return response.json();
}

export function useCalendarEvents(params: GetCalendarEventsParams = {}) {
  return useQuery({
    queryKey: ['calendar', 'events', params],
    queryFn: () => fetchCalendarEvents(params),
  });
}

