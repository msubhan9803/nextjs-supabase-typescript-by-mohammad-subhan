import { ClientRepository } from '@/backend/repositories/client-repository';
import type {
  Client,
  CreateClientInput,
  UpdateClientInput,
} from '@/backend/entities/client';

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async getAllClients(userId: string): Promise<Client[]> {
    return this.clientRepository.findAllByUserId(userId);
  }

  async getClientById(id: string, userId: string): Promise<Client> {
    const client = await this.clientRepository.findById(id, userId);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  async createClient(input: CreateClientInput, userId: string): Promise<Client> {
    return this.clientRepository.create(input, userId);
  }

  async updateClient(
    id: string,
    input: UpdateClientInput,
    userId: string
  ): Promise<Client> {
    // Verify ownership
    await this.getClientById(id, userId);
    return this.clientRepository.update(id, input, userId);
  }

  async deleteClient(id: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getClientById(id, userId);
    return this.clientRepository.delete(id, userId);
  }

  async getClientsByIds(ids: string[], userId: string): Promise<Client[]> {
    const clients = await this.clientRepository.findByIds(ids, userId);
    // Verify all clients belong to the user
    if (clients.length !== ids.length) {
      throw new Error('One or more clients not found or do not belong to you');
    }
    return clients;
  }
}

