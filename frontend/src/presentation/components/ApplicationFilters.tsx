'use client';

import { RotateCcw } from 'lucide-react';
import { STATUS_LABELS } from '@/presentation/messages/statusLabels';
import { CHANNEL_LABELS } from '@/presentation/constants/channels';
import { listPageMessages } from '@/presentation/messages/list';

interface ApplicationFiltersProps {
  status: string;
  channel: string;
  search: string;
  disabled?: boolean;
  onStatusChange: (value: string) => void;
  onChannelChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset?: () => void;
}

export function ApplicationFilters({
  status,
  channel,
  search,
  disabled = false,
  onStatusChange,
  onChannelChange,
  onSearchChange,
  onReset,
}: ApplicationFiltersProps) {
  const hasActiveFilters =
    status !== 'all' || channel !== 'all' || search !== '';

  return (
    <div className="mt-4 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="status-filter" className="text-xs text-slate-500">
          Estado
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={disabled}
          className="border rounded p-2 disabled:opacity-50"
          aria-label={listPageMessages.allStatuses}
        >
          <option value="all">{listPageMessages.allStatuses}</option>
          {Object.keys(STATUS_LABELS).map((code) => (
            <option key={code} value={code}>
              {STATUS_LABELS[code]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="channel-filter" className="text-xs text-slate-500">
          Canal
        </label>
        <select
          id="channel-filter"
          value={channel}
          onChange={(e) => onChannelChange(e.target.value)}
          disabled={disabled}
          className="border rounded p-2 disabled:opacity-50"
          aria-label={listPageMessages.allChannels}
        >
          <option value="all">{listPageMessages.allChannels}</option>
          {Object.keys(CHANNEL_LABELS).map((code) => (
            <option key={code} value={code}>
              {CHANNEL_LABELS[code]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="search-filter" className="text-xs text-slate-500">
          Buscar
        </label>
        <input
          id="search-filter"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={listPageMessages.searchPlaceholder}
          disabled={disabled}
          className="border rounded p-2 disabled:opacity-50"
          aria-label={listPageMessages.searchPlaceholder}
        />
      </div>

      {hasActiveFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          aria-label={listPageMessages.clearFilters}
        >
          <RotateCcw size={16} aria-hidden="true" />
          {listPageMessages.clearFilters}
        </button>
      )}
    </div>
  );
}
