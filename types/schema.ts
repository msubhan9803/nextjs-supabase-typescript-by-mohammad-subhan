import type { Database } from '@/types/database';

// Row types (from database)
export type ClientRow = Database['public']['Tables']['clients']['Row'];
export type EmailTemplateRow = Database['public']['Tables']['email_templates']['Row'];
export type GoogleTokenRow = Database['public']['Tables']['google_tokens']['Row'];

// Insert types
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type EmailTemplateInsert = Database['public']['Tables']['email_templates']['Insert'];
export type GoogleTokenInsert = Database['public']['Tables']['google_tokens']['Insert'];

// Update types
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type EmailTemplateUpdate = Database['public']['Tables']['email_templates']['Update'];
export type GoogleTokenUpdate = Database['public']['Tables']['google_tokens']['Update'];

// CalendarEvent (not a database entity, used for Google Calendar API)
export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start: Date;
  end: Date;
  location: string | null;
}
