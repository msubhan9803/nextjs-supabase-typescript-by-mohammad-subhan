export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEmailTemplateInput {
  name: string;
  subject: string;
  body: string;
}

export interface UpdateEmailTemplateInput {
  name?: string;
  subject?: string;
  body?: string;
}

