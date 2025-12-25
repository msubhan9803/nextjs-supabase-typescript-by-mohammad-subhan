import { EmailTemplateRepository } from '@/backend/repositories/email-template-repository';
import type {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
} from '@/lib/validations/email-template';
import type { EmailTemplateRow } from '@/types/schema';

export class EmailTemplateService {
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository
  ) {}

  async getAllTemplates(userId: string): Promise<EmailTemplateRow[]> {
    return this.emailTemplateRepository.findAllByUserId(userId);
  }

  async getTemplateById(id: string, userId: string): Promise<EmailTemplateRow> {
    const template = await this.emailTemplateRepository.findById(id, userId);
    if (!template) {
      throw new Error('Email template not found');
    }
    return template;
  }

  async createTemplate(
    input: CreateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplateRow> {
    return this.emailTemplateRepository.create(input, userId);
  }

  async updateTemplate(
    id: string,
    input: UpdateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplateRow> {
    // Verify ownership
    await this.getTemplateById(id, userId);
    return this.emailTemplateRepository.update(id, input, userId);
  }

  async deleteTemplate(id: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getTemplateById(id, userId);
    return this.emailTemplateRepository.delete(id, userId);
  }
}

