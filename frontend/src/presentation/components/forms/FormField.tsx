import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  registration,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 sm:text-base">
        {label}
      </label>
      <input
        id={id}
        type={type}
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
