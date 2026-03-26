"use client";

import { Controller, type Control, type FieldPath } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  ALLOWED_TAGS,
  type AllowedArtworkTag,
} from "@/lib/constants/artwork-tags";

type FormTagPillFieldProps<TFormValues extends Record<string, any>> = {
  name: FieldPath<TFormValues>;
  label: string;
  control: Control<TFormValues>;
  description?: string;
};

export function FormTagPillField<TFormValues extends Record<string, any>>({
  name,
  label,
  control,
  description = "Choose from the predefined tags.",
}: FormTagPillFieldProps<TFormValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedTags = (field.value ?? []) as AllowedArtworkTag[];

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-xl" htmlFor={field.name}>
              {label}
            </FieldLabel>

            <div className="flex flex-wrap gap-3">
              {ALLOWED_TAGS.map((tag) => {
                const isActive = selectedTags.includes(tag);

                function handleToggle() {
                  if (isActive) {
                    field.onChange(
                      selectedTags.filter((value) => value !== tag)
                    );
                    return;
                  }

                  field.onChange([...selectedTags, tag]);
                }

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={handleToggle}
                    aria-pressed={isActive}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-pink-500 bg-pink-500/20 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{tag}</span>

                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-xs leading-none"
                      >
                        ×
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : (
              <FieldDescription className="text-base">
                {description}
              </FieldDescription>
            )}
          </Field>
        );
      }}
    />
  );
}
