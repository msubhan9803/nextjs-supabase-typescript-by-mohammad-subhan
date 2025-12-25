import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ClientRow } from '@/types/schema';
import type { CreateClientInput, UpdateClientInput } from '@/lib/validations/client';

const API_BASE = '/api/clients';

async function fetchClients(): Promise<ClientRow[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

async function createClient(input: CreateClientInput): Promise<ClientRow> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create client');
  }
  return response.json();
}

async function updateClient(
  id: string,
  input: UpdateClientInput
): Promise<ClientRow> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update client');
  }
  return response.json();
}

async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete client');
  }
}

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClientInput }) =>
      updateClient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

