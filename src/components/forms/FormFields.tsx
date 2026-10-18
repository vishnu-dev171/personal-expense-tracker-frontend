import type { ReactNode } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface BaseFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

interface Option {
  label: string;
  value: string | number;
}

function FieldWrapper({
  label,
  required,
  error,
  helperText,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
  placeholder,
  type = "text",
}: BaseFieldProps<T> & { placeholder?: string; type?: string }) {
  const { field, fieldState } = useController({ name, control });
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <input
        type={type}
        {...field}
        disabled={disabled}
        placeholder={placeholder}
        className="input-base"
        aria-invalid={!!fieldState.error}
      />
    </FieldWrapper>
  );
}

export function FormPasswordInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
  placeholder,
}: BaseFieldProps<T> & { placeholder?: string }) {
  const { field, fieldState } = useController({ name, control });
  const [visible, setVisible] = useState(false);

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          {...field}
          disabled={disabled}
          placeholder={placeholder}
          className="input-base pr-10"
          aria-invalid={!!fieldState.error}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:text-brand-600 disabled:cursor-not-allowed"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
    </FieldWrapper>
  );
}

export function FormNumberInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
  placeholder,
  min,
}: BaseFieldProps<T> & { placeholder?: string; min?: number }) {
  const { field, fieldState } = useController({ name, control });
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <input
        type="number"
        {...field}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        onChange={(e) =>
          field.onChange(
            e.target.value === "" ? undefined : Number(e.target.value),
          )
        }
        className="input-base"
        aria-invalid={!!fieldState.error}
      />
    </FieldWrapper>
  );
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
  placeholder,
  rows = 3,
}: BaseFieldProps<T> & { placeholder?: string; rows?: number }) {
  const { field, fieldState } = useController({ name, control });
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <textarea
        {...field}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className="input-base resize-none"
        aria-invalid={!!fieldState.error}
      />
    </FieldWrapper>
  );
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
  options,
  placeholder,
}: BaseFieldProps<T> & {
  options: Option[];
  placeholder?: string;
}) {
  const { field, fieldState } = useController({ name, control });
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <select
        {...field}
        disabled={disabled}
        className="input-base select appearance-none"
        aria-invalid={!!fieldState.error}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function FormDateInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
  min,
  max,
}: BaseFieldProps<T> & { min?: string; max?: string }) {
  const { field, fieldState } = useController({ name, control });
  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      <input
        type="date"
        {...field}
        disabled={disabled}
        min={min}
        max={max}
        className="input-base"
        aria-invalid={!!fieldState.error}
      />
    </FieldWrapper>
  );
}

export function FormCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
}: BaseFieldProps<T> & { label: string }) {
  const { field } = useController({ name, control });
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={!!field.value}
        onChange={(e) => field.onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
      />
      {label}
    </label>
  );
}

export function FormFileUpload<T extends FieldValues>({
  name,
  control,
  label,
  required,
  helperText,
  disabled,
}: BaseFieldProps<T>) {
  const { field, fieldState } = useController({ name, control });
  const fileName = typeof field.value === "string" ? field.value : "";

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={fieldState.error?.message}
      helperText={helperText}
    >
      {fileName ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
          <span className="truncate text-sm text-slate-600">{fileName}</span>
          <button
            type="button"
            onClick={() => field.onChange("")}
            disabled={disabled}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ) : (
        <input
          type="file"
          disabled={disabled}
          onChange={(e) => field.onChange(e.target.files?.[0]?.name ?? "")}
          className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
      )}
    </FieldWrapper>
  );
}
