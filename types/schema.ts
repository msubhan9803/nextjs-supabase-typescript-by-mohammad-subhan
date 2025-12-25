import type { Database } from '@/types/database';

export type ClientRow = Database['public']['Tables']['clients']['Row'];
export type EmailTemplateRow = Database['public']['Tables']['email_templates']['Row'];
export type GoogleTokenRow = Database['public']['Tables']['google_tokens']['Row'];
