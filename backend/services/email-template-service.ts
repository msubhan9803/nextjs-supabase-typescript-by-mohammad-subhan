import { EmailTemplateRepository } from '@/backend/repositories/email-template-repository';
import type {
  EmailTemplate,
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
} from '@/backend/entities/email-template';

export class EmailTemplateService {
  constructor(
    private readonly emailTemplateRepository: EmailTemplateRepository
  ) {}

  async getAllTemplates(userId: string): Promise<EmailTemplate[]> {
    return this.emailTemplateRepository.findAllByUserId(userId);
  }

  async getTemplateById(id: string, userId: string): Promise<EmailTemplate> {
    const template = await this.emailTemplateRepository.findById(id, userId);
    if (!template) {
      throw new Error('Email template not found');
    }
    return template;
  }

  async createTemplate(
    input: CreateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplate> {
    return this.emailTemplateRepository.create(input, userId);
  }

  async updateTemplate(
    id: string,
    input: UpdateEmailTemplateInput,
    userId: string
  ): Promise<EmailTemplate> {
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

