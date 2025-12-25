import { createClient } from '@/lib/supabase/server';
import type {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
} from '@/lib/validations/email-template';
import { TABLES } from '@/lib/constants';
import type { EmailTemplateRow } from '@/types/schema';

export class EmailTemplateRepository {
  async findAllByUserId(userId: string): Promise<EmailTemplateRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch email templates: ${error.message}`);
    }

    return data ?? [];
  }

  async findById(id: string, userId: string): Promise<EmailTemplateRow | null> {
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

    return data;
  }

  async create(
    input: CreateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplateRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .insert({
        user_id: userId,
        name: input.name,
        subject: input.subject,
        body: input.body,
      } as never)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create email template: ${error.message}`);
    }

    return data;
  }

  async update(
    id: string,
    input: UpdateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplateRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.EMAIL_TEMPLATES)
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      } as never)
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

    return data;
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
}

