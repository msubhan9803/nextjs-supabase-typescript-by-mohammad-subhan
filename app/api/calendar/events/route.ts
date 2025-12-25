import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { GoogleCalendarService } from '@/backend/services/google-calendar-service';
import { GoogleTokenRepository } from '@/backend/repositories/google-token-repository';

const calendarService = new GoogleCalendarService(new GoogleTokenRepository());

function getDateRange(period?: string): { timeMin: Date; timeMax: Date } {
  const now = new Date();
  let timeMin: Date;
  let timeMax: Date;

  switch (period) {
    case 'today':
      timeMin = new Date(now.setHours(0, 0, 0, 0));
      timeMax = new Date(now.setHours(23, 59, 59, 999));
      break;
    case 'week':
      timeMin = new Date(now.setDate(now.getDate() - now.getDay()));
      timeMin.setHours(0, 0, 0, 0);
      timeMax = new Date(timeMin);
      timeMax.setDate(timeMax.getDate() + 6);
      timeMax.setHours(23, 59, 59, 999);
      break;
    case 'month':
      timeMin = new Date(now.getFullYear(), now.getMonth(), 1);
      timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    default:
      timeMin = new Date(now.setHours(0, 0, 0, 0));
      timeMax = new Date(now.setFullYear(now.getFullYear() + 1));
  }

  return { timeMin, timeMax };
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') ?? undefined;
    const timeMinParam = searchParams.get('timeMin');
    const timeMaxParam = searchParams.get('timeMax');

    let timeMin: Date;
    let timeMax: Date;

    if (timeMinParam && timeMaxParam) {
      timeMin = new Date(timeMinParam);
      timeMax = new Date(timeMaxParam);
    } else {
      const range = getDateRange(period);
      timeMin = range.timeMin;
      timeMax = range.timeMax;
    }

    const events = await calendarService.getEvents(user.id, timeMin, timeMax);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to fetch calendar events',
      },
      { status: 500 }
    );
  }
}

