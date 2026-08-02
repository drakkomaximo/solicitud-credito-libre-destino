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
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className="mt-1 w-full border rounded p-2"
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
