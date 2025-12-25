'use client';

import { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { useEmailTemplates } from '@/hooks/use-email-templates';
import { useSendEmails } from '@/hooks/use-email';
import type { Client } from '@/backend/entities/client';

export default function EmailsPage() {
  const { data: clients } = useClients();
  const { data: templates } = useEmailTemplates();
  const sendEmails = useSendEmails();
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleTemplateSelect = (templateId: string) => {
    const template = templates?.find((t) => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
      setSelectedTemplateId(templateId);
    }
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (clients) {
      setSelectedClientIds(
        selectedClientIds.length === clients.length
          ? []
          : clients.map((c) => c.id)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClientIds.length === 0) {
      alert('Please select at least one client');
      return;
    }
    if (!subject.trim() || !body.trim()) {
      alert('Please fill in both subject and body');
      return;
    }

    try {
      const result = await sendEmails.mutateAsync({
        clientIds: selectedClientIds,
        subject,
        body,
      });

      const successCount = result.results.filter((r) => r.success).length;
      const failCount = result.results.filter((r) => !r.success).length;

      if (failCount === 0) {
        alert(`Successfully sent ${successCount} email(s)!`);
        setSelectedClientIds([]);
        setSubject('');
        setBody('');
        setSelectedTemplateId('');
      } else {
        alert(
          `Sent ${successCount} email(s), ${failCount} failed. Check console for details.`
        );
        console.error('Failed emails:', result.results.filter((r) => !r.success));
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send emails');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Send Email</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Template (Optional)
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            >
              <option value="">None</option>
              {templates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Select Clients *
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedClientIds.length === clients?.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-gray-300 p-4">
              {clients?.map((client) => (
                <label
                  key={client.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedClientIds.includes(client.id)}
                    onChange={() => handleClientToggle(client.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {client.name} ({client.email})
                  </span>
                </label>
              ))}
              {(!clients || clients.length === 0) && (
                <p className="text-sm text-gray-500">No clients available</p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message Body *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="Email body (use {{client_name}}, {{email}}, {{date}} for dynamic variables)"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Available variables: {`{{client_name}}`}, {`{{email}}`},{' '}
              {`{{date}}`}
            </p>
          </div>

          <button
            type="submit"
            disabled={sendEmails.isPending || selectedClientIds.length === 0}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {sendEmails.isPending ? 'Sending...' : 'Send Emails'}
          </button>
        </form>
      </div>
    </div>
  );
}

