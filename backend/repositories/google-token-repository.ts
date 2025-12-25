import { createClient } from '@/lib/supabase/server';
import { TABLES } from '@/lib/constants';
import type { GoogleTokenRow, GoogleTokenInsert, GoogleTokenUpdate } from '@/types/schema';

export interface CreateGoogleTokenInput {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}

export interface UpdateGoogleTokenInput {
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
}

export class GoogleTokenRepository {
  async findByUserId(userId: string): Promise<GoogleTokenRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.GOOGLE_TOKENS)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch Google token: ${error.message}`);
    }

    return data;
  }

  async create(input: CreateGoogleTokenInput): Promise<GoogleTokenRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.GOOGLE_TOKENS)
      .insert({
        user_id: input.user_id,
        access_token: input.access_token,
        refresh_token: input.refresh_token,
        expires_at: input.expires_at.toISOString(),
      } as GoogleTokenInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create Google token: ${error.message}`);
    }

    return data;
  }

  async upsert(input: CreateGoogleTokenInput): Promise<GoogleTokenRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.GOOGLE_TOKENS)
      .upsert(
        {
          user_id: input.user_id,
          access_token: input.access_token,
          refresh_token: input.refresh_token,
          expires_at: input.expires_at.toISOString(),
          updated_at: new Date().toISOString(),
        } as GoogleTokenInsert,
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert Google token: ${error.message}`);
    }

    return data;
  }

  async update(
    userId: string,
    input: UpdateGoogleTokenInput
  ): Promise<GoogleTokenRow> {
    const supabase = await createClient();
    const updateData: GoogleTokenUpdate = {
      ...input,
      expires_at: input.expires_at?.toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from(TABLES.GOOGLE_TOKENS)
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update Google token: ${error.message}`);
    }

    if (!data) {
      throw new Error('Google token not found');
    }

    return data;
  }
}

