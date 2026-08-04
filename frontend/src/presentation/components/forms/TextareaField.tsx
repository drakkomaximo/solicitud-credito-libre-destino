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
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...registration}
        className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm">
          {error.message}
        </p>
      )}
    </div>
  );
}
