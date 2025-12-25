import { google, type Auth } from 'googleapis';
import { GoogleTokenRepository } from '@/backend/repositories/google-token-repository';
import type { CalendarEvent } from '@/backend/entities/calendar-event';

export class GoogleCalendarService {
  constructor(private readonly googleTokenRepository: GoogleTokenRepository) {}

  async getEvents(
    userId: string,
    timeMin: Date,
    timeMax: Date
  ): Promise<CalendarEvent[]> {
    const token = await this.googleTokenRepository.findByUserId(userId);
    if (!token) {
      throw new Error('Google tokens not found. Please reconnect your Google account.');
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    });

    // Check if token is expired and refresh if needed
    if (new Date() >= token.expires_at) {
      await this.refreshToken(userId, oauth2Client);
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items ?? [];

      return events.map((event) => ({
        id: event.id ?? '',
        title: event.summary ?? 'No title',
        description: event.description ?? null,
        start: new Date(event.start?.dateTime ?? event.start?.date ?? ''),
        end: new Date(event.end?.dateTime ?? event.end?.date ?? ''),
        location: event.location ?? null,
      }));
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        // Token might be invalid, try refreshing
        await this.refreshToken(userId, oauth2Client);
        // Retry the request
        const calendarRetry = google.calendar({ version: 'v3', auth: oauth2Client });
        const response = await calendarRetry.events.list({
          calendarId: 'primary',
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = response.data.items ?? [];
        return events.map((event) => ({
          id: event.id ?? '',
          title: event.summary ?? 'No title',
          description: event.description ?? null,
          start: new Date(event.start?.dateTime ?? event.start?.date ?? ''),
          end: new Date(event.end?.dateTime ?? event.end?.date ?? ''),
          location: event.location ?? null,
        }));
      }
      throw error;
    }
  }

  private async refreshToken(
    userId: string,
    oauth2Client: Auth.OAuth2Client
  ): Promise<void> {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      if (credentials.access_token && credentials.expiry_date) {
        await this.googleTokenRepository.update(userId, {
          access_token: credentials.access_token,
          expires_at: new Date(credentials.expiry_date),
        });
        oauth2Client.setCredentials(credentials);
      }
    } catch (error) {
      throw new Error(
        `Failed to refresh Google token: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

