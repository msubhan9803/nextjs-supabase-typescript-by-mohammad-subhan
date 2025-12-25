import { google, type Auth } from 'googleapis';
import { GoogleTokenRepository } from '@/backend/repositories/google-token-repository';
import { ClientRepository } from '@/backend/repositories/client-repository';
import type { ClientRow } from '@/types/schema';

export interface EmailSendResult {
  success: boolean;
  recipient: string;
  error?: string;
}

export interface SendEmailInput {
  clientIds: string[];
  subject: string;
  body: string;
}

export class EmailService {
  constructor(
    private readonly googleTokenRepository: GoogleTokenRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async sendEmails(
    userId: string,
    input: SendEmailInput
  ): Promise<EmailSendResult[]> {
    const token = await this.googleTokenRepository.findByUserId(userId);
    if (!token) {
      throw new Error('Google tokens not found. Please reconnect your Google account.');
    }

    // Get clients
    const clients = await this.clientRepository.findByIds(input.clientIds, userId);
    if (clients.length !== input.clientIds.length) {
      throw new Error('One or more clients not found or do not belong to you');
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    });

    // Check if token is expired and refresh if needed
    if (token.expires_at && new Date() >= new Date(token.expires_at)) {
      await this.refreshToken(userId, oauth2Client);
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const results: EmailSendResult[] = [];

    for (const client of clients) {
      try {
        const personalizedBody = this.replaceTemplateVariables(
          input.body,
          client
        );
        const personalizedSubject = this.replaceTemplateVariables(
          input.subject,
          client
        );

        const message = this.createEmailMessage(
          client.email,
          personalizedSubject,
          personalizedBody
        );

        await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: message,
          },
        });

        results.push({
          success: true,
          recipient: client.email,
        });
      } catch (error) {
        results.push({
          success: false,
          recipient: client.email,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    }

    return results;
  }

  private createEmailMessage(
    to: string,
    subject: string,
    body: string
  ): string {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
    ].join('\n');

    return Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private replaceTemplateVariables(template: string, client: ClientRow): string {
    return template
      .replace(/\{\{client_name\}\}/g, client.name)
      .replace(/\{\{email\}\}/g, client.email)
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString());
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

