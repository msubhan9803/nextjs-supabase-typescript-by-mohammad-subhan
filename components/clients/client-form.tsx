'use client';

import { useState, useEffect } from 'react';
import { useCreateClient, useUpdateClient } from '@/hooks/use-clients';
import type { ClientRow } from '@/types/schema';
import type { CreateClientInput } from '@/lib/validations/client';

interface ClientFormProps {
  client?: ClientRow | null;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [formData, setFormData] = useState<CreateClientInput>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateClientInput, string>>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone ?? '',
        notes: client.notes ?? '',
      });
    }
  }, [client]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateClientInput, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (client) {
        await updateClient.mutateAsync({ id: client.id, input: formData });
      } else {
        await createClient.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save client');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {client ? 'Edit Client' : 'Add Client'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value || null })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value || null })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClient.isPending || updateClient.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createClient.isPending || updateClient.isPending
                ? 'Saving...'
                : client
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

