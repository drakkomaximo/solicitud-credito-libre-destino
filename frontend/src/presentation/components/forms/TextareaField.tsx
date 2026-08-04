import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface TextareaFieldProps {
  id: string;
  label: string;
  rows?: number;
  placeholder?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

export function TextareaField({
  id,
  label,
  rows = 4,
  placeholder,
  error,
  registration,
}: TextareaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 sm:text-base">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...registration}
        className="mt-2 w-full rounded-xl border border-slate-200 p-3.5 text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:p-3 sm:text-sm"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}
