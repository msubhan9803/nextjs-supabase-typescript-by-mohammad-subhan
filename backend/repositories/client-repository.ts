import { createClient } from '@/lib/supabase/server';
import type { Client, CreateClientInput, UpdateClientInput } from '@/backend/entities/client';
import { TABLES } from '@/lib/constants';

export class ClientRepository {
  async findAllByUserId(userId: string): Promise<Client[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return (data ?? []).map(this.mapRowToEntity);
  }

  async findById(id: string, userId: string): Promise<Client | null> {
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

    return data ? this.mapRowToEntity(data) : null;
  }

  async create(input: CreateClientInput, userId: string): Promise<Client> {
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

    return this.mapRowToEntity(data);
  }

  async update(id: string, input: UpdateClientInput, userId: string): Promise<Client> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
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

    return this.mapRowToEntity(data);
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

  async findByIds(ids: string[], userId: string): Promise<Client[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLES.CLIENTS)
      .select('*')
      .in('id', ids)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }

    return (data ?? []).map(this.mapRowToEntity);
  }

  private mapRowToEntity(row: {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }): Client {
    return {
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      notes: row.notes,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}

