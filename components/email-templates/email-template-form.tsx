'use client';

import { useState, useEffect } from 'react';
import { useCreateEmailTemplate, useUpdateEmailTemplate } from '@/hooks/use-email-templates';
import type { EmailTemplateRow } from '@/types/schema';
import type { CreateEmailTemplateInput } from '@/lib/validations/email-template';

interface EmailTemplateFormProps {
  template?: EmailTemplateRow | null;
  onClose: () => void;
}

export function EmailTemplateForm({ template, onClose }: EmailTemplateFormProps) {
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const [formData, setFormData] = useState<CreateEmailTemplateInput>({
    name: '',
    subject: '',
    body: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateEmailTemplateInput, string>>>({});

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    }
  }, [template]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateEmailTemplateInput, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.body.trim()) {
      newErrors.body = 'Body is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (template) {
        await updateTemplate.mutateAsync({ id: template.id, input: formData });
      } else {
        await createTemplate.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save template');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {template ? 'Edit Template' : 'Create Template'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template Name *
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
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Body *
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows={10}
              placeholder="Use {{client_name}}, {{email}}, {{date}} for dynamic variables"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Available variables: {`{{client_name}}`}, {`{{email}}`},{' '}
              {`{{date}}`}
            </p>
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body}</p>
            )}
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
              disabled={createTemplate.isPending || updateTemplate.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createTemplate.isPending || updateTemplate.isPending
                ? 'Saving...'
                : template
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

