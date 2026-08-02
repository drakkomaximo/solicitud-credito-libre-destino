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
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          {...registration}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="text-sm">
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
