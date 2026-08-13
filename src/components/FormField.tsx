"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  containerClassName?: string;
  error?: FieldError;
  register?: UseFormRegisterReturn;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface TextareaProps
  extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

type FormFieldProps = InputProps | TextareaProps;

export const FormField = (props: FormFieldProps) => {
  const {
    label,
    containerClassName,
    error,
    register,
    as = "input",
    ...rest
  } = props;

  const fieldClassName = cn(
    "bg-background text-foreground placeholder:text-muted-foreground",
    "w-full border border-border-secondary",
    "outline-none",
    "transition-[border-color,background-color,box-shadow] duration-300",
    "focus:border-custom-primary",
    "focus:ring-2 focus:ring-custom-primary/10",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "rtl:text-right",
    error &&
      "border-destructive focus:border-destructive focus:ring-destructive/10",
  );

  return (
    <div className={cn("flex flex-col gap-2.5", containerClassName)}>
      <div className="flex items-center justify-between gap-3 px-0.5">
        <label className="text-foreground text-sm font-medium">{label}</label>

        {error && (
          <p className="text-destructive text-xs font-medium mt-1">
            {error.message}
          </p>
        )}
      </div>

      {as === "textarea" ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...register}
          className={cn(
            fieldClassName,
            "min-h-32 resize-none px-4 py-3 text-[15px] leading-7",
          )}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          {...register}
          className={cn(fieldClassName, "h-12 px-4 text-[15px]")}
        />
      )}
    </div>
  );
};
