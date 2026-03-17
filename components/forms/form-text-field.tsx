import { Controller, type Control, type FieldPath } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormTextFieldProps<TFormValues extends Record<string, any>> = {
  name: FieldPath<TFormValues>;
  label: string;
  control: Control<TFormValues>;
  placeholder?: string;
  description?: string;
};

export function FormTextField<TFormValues extends Record<string, any>>({
  name,
  label,
  control,
  placeholder,
  description,
}: FormTextFieldProps<TFormValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
          />
          <FieldDescription
            className={fieldState.invalid ? "text-destructive" : ""}
          >
            {fieldState.error?.message ?? description}
          </FieldDescription>
        </Field>
      )}
    />
  );
}
