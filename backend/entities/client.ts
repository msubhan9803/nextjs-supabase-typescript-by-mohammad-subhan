export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  phone?: string | null;
  notes?: string | null;
}

