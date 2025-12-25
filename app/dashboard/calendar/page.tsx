'use client';

import { useState } from 'react';
import { useCalendarEvents } from '@/hooks/use-calendar';
import { useQueryClient } from '@tanstack/react-query';

export default function CalendarPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const { data: events, isLoading, refetch } = useCalendarEvents({ period });
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['calendar'] });
    refetch();
  };

  if (isLoading) {
    return <div className="text-center">Loading calendar events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as 'today' | 'week' | 'month')
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={handleRefresh}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {events && events.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-500">No events found for the selected period.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events?.map((event) => (
            <div
              key={event.id}
              className="rounded-lg bg-white p-6 shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Start:</strong>{' '}
                  {new Date(event.start).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong> {new Date(event.end).toLocaleString()}
                </p>
                {event.location && (
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                )}
                {event.description && (
                  <p className="mt-2 text-gray-700">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

