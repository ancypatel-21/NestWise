import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "min-h-11 w-full border-2 border-[var(--color-graphite)] bg-[var(--color-surface)] px-3.5 text-[0.95rem] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] [border-radius:14px_9px_13px_10px/10px_13px_9px_14px]";

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[var(--color-ink)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-danger)]">*</span>}
      </label>
      {hint && <p className="text-xs text-[var(--color-ink-soft)]">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs font-semibold text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlBase, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(controlBase, "min-h-24 py-2.5", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(controlBase, "pr-8", className)} {...props} />
));
Select.displayName = "Select";

export function CheckboxRow({
  label,
  description,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string }) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-accent)]"
        {...props}
      />
      <span>
        <span className="block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
        {description && (
          <span className="block text-xs text-[var(--color-ink-soft)]">{description}</span>
        )}
      </span>
    </label>
  );
}
