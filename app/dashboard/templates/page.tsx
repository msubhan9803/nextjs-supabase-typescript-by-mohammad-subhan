'use client';

import { useState } from 'react';
import { useEmailTemplates, useDeleteEmailTemplate } from '@/hooks/use-email-templates';
import { EmailTemplateForm } from '@/components/email-templates/email-template-form';
import type { EmailTemplateRow } from '@/types/schema';

export default function TemplatesPage() {
  const { data: templates, isLoading } = useEmailTemplates();
  const deleteTemplate = useDeleteEmailTemplate();
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplateRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete template');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowForm(true);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Template
        </button>
      </div>

      {showForm && (
        <EmailTemplateForm
          template={editingTemplate}
          onClose={() => {
            setShowForm(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {templates && templates.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No templates yet. Create your first template!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="rounded-lg bg-white p-6 shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {template.name}
              </h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Subject:</strong> {template.subject}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  <strong>Body:</strong> {template.body}
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowForm(true);
                  }}
                  className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

