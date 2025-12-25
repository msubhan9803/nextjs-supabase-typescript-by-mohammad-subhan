import { createClient } from '@/lib/supabase/server';
import type {
  GoogleToken,
  CreateGoogleTokenInput,
  UpdateGoogleTokenInput,
} from '@/backend/entities/google-token';
import { TABLES } from '@/lib/constants';

export class GoogleTokenRepository {
  async findByUserId(userId: string): Promise<GoogleToken | null> {
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

    return data ? this.mapRowToEntity(data) : null;
  }

  async create(input: CreateGoogleTokenInput): Promise<GoogleToken> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.GOOGLE_TOKENS)
      .insert({
        user_id: input.user_id,
        access_token: input.access_token,
        refresh_token: input.refresh_token,
        expires_at: input.expires_at.toISOString(),
      } as never)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create Google token: ${error.message}`);
    }

    return this.mapRowToEntity(data);
  }

  async upsert(input: CreateGoogleTokenInput): Promise<GoogleToken> {
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
        } as never,
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert Google token: ${error.message}`);
    }

    return this.mapRowToEntity(data);
  }

  async update(
    userId: string,
    input: UpdateGoogleTokenInput
  ): Promise<GoogleToken> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.GOOGLE_TOKENS)
      .update({
        ...input,
        expires_at: input.expires_at?.toISOString(),
        updated_at: new Date().toISOString(),
      } as never)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update Google token: ${error.message}`);
    }

    if (!data) {
      throw new Error('Google token not found');
    }

    return this.mapRowToEntity(data);
  }

  private mapRowToEntity(row: {
    id: string;
    user_id: string;
    access_token: string;
    refresh_token: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
  }): GoogleToken {
    return {
      id: row.id,
      user_id: row.user_id,
      access_token: row.access_token,
      refresh_token: row.refresh_token,
      expires_at: new Date(row.expires_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}

