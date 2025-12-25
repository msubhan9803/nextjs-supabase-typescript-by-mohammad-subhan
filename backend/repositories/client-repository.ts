import { createClient } from '@/lib/supabase/server';
import type { CreateClientInput, UpdateClientInput } from '@/lib/validations/client';
import { TABLES } from '@/lib/constants';
import type { ClientRow } from '@/types/schema';

export class ClientRepository {
  async findAllByUserId(userId: string): Promise<ClientRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return data ?? [];
  }

  async findById(id: string, userId: string): Promise<ClientRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch client: ${error.message}`);
    }

    return data;
  }

  async create(input: CreateClientInput, userId: string): Promise<ClientRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .insert({
        user_id: userId,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        notes: input.notes ?? null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }

    return data;
  }

  async update(id: string, input: UpdateClientInput, userId: string): Promise<ClientRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update client: ${error.message}`);
    }

    if (!data) {
      throw new Error('Client not found');
    }

    return data;
  }

  async delete(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from(TABLES.CLIENTS)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  async findByIds(ids: string[], userId: string): Promise<ClientRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .select('*')
      .in('id', ids)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return data ?? [];
  }
}

