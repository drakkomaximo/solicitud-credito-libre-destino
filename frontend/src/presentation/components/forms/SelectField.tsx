import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

export function SelectField({
  id,
  label,
  placeholder,
  options,
  error,
  registration,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        {...registration}
        className="mt-1 w-full border rounded p-2"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm">
          {error.message}
        </p>
      )}
    </div>
  );
}
