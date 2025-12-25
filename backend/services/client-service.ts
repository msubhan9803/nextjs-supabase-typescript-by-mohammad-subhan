import { ClientRepository } from '@/backend/repositories/client-repository';
import type { CreateClientInput, UpdateClientInput } from '@/lib/validations/client';
import type { ClientRow } from '@/types/schema';

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async getAllClients(userId: string): Promise<ClientRow[]> {
    return this.clientRepository.findAllByUserId(userId);
  }

  async getClientById(id: string, userId: string): Promise<ClientRow> {
    const client = await this.clientRepository.findById(id, userId);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  async createClient(input: CreateClientInput, userId: string): Promise<ClientRow> {
    return this.clientRepository.create(input, userId);
  }

  async updateClient(
    id: string,
    input: UpdateClientInput,
    userId: string
  ): Promise<ClientRow> {
    // Verify ownership
    await this.getClientById(id, userId);
    return this.clientRepository.update(id, input, userId);
  }

  async deleteClient(id: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getClientById(id, userId);
    return this.clientRepository.delete(id, userId);
  }

  async getClientsByIds(ids: string[], userId: string): Promise<ClientRow[]> {
    const clients = await this.clientRepository.findByIds(ids, userId);
    // Verify all clients belong to the user
    if (clients.length !== ids.length) {
      throw new Error('One or more clients not found or do not belong to you');
    }
    return clients;
  }
}

