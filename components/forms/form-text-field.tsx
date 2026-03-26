import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormTextFieldProps<TFormValues extends FieldValues> = {
  name: FieldPath<TFormValues>;
  label: string;
  control: Control<TFormValues>;
  placeholder?: string;
  description?: string;
};

export function FormTextField<TFormValues extends FieldValues>({
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
          <FieldLabel className="text-xl" htmlFor={field.name}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className="h-12 bg-gray-800! text-lg! text-foreground placeholder:text-muted-foreground"
          />
          <FieldDescription
            className={
              fieldState.invalid ? "text-destructive text-base!" : " text-base!"
            }
          >
            {fieldState.error?.message ?? description}
          </FieldDescription>
        </Field>
      )}
    />
  );
}
