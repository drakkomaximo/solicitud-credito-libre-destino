import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxFieldProps {
  id: string;
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

export function CheckboxField({
  id,
  label,
  error,
  registration,
}: CheckboxFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <input
          id={id}
          type="checkbox"
          {...registration}
          className="h-5 w-5 cursor-pointer rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="cursor-pointer text-sm text-slate-700">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm">
          {error.message}
        </p>
      )}
    </div>
  );
}
