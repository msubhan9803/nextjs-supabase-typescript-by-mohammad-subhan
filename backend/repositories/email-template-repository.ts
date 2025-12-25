import { createClient } from '@/lib/supabase/server';
import type {
  EmailTemplate,
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
} from '@/backend/entities/email-template';
import { TABLES } from '@/lib/constants';

export class EmailTemplateRepository {
  async findAllByUserId(userId: string): Promise<EmailTemplate[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch email templates: ${error.message}`);
    }

    return (data ?? []).map(this.mapRowToEntity);
  }

  async findById(id: string, userId: string): Promise<EmailTemplate | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch email template: ${error.message}`);
    }

    return data ? this.mapRowToEntity(data) : null;
  }

  async create(
    input: CreateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplate> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .insert({
        user_id: userId,
        name: input.name,
        subject: input.subject,
        body: input.body,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create email template: ${error.message}`);
    }

    return this.mapRowToEntity(data);
  }

  async update(
    id: string,
    input: UpdateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplate> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update email template: ${error.message}`);
    }

    if (!data) {
      throw new Error('Email template not found');
    }

    return this.mapRowToEntity(data);
  }

  async delete(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete email template: ${error.message}`);
    }
  }

  private mapRowToEntity(row: {
    id: string;
    user_id: string;
    name: string;
    subject: string;
    body: string;
    created_at: string;
    updated_at: string;
  }): EmailTemplate {
    return {
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      subject: row.subject,
      body: row.body,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}

