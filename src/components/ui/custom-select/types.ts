import { FieldError } from "react-hook-form";

export interface CustomSelectOption<T extends string = string> {
  label: string;
  value: T;
}

export interface CustomSelectProps<T extends string = string> {
  label?: string;
  placeholder?: string;

  options: CustomSelectOption<T>[];

  value: T;

  onChange: (value: T) => void;

  disabled?: boolean;

  className?: string;

  error?: FieldError;
}
