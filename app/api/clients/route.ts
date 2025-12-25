import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ClientService } from '@/backend/services/client-service';
import { ClientRepository } from '@/backend/repositories/client-repository';
import { createClientSchema } from '@/lib/validations/client';

const clientService = new ClientService(new ClientRepository());

export async function GET() {
  try {
    const user = await requireAuth();
    const clients = await clientService.getAllClients(user.id);
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);
    const client = await clientService.createClient(validatedData, user.id);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create client' },
      { status: 500 }
    );
  }
}

