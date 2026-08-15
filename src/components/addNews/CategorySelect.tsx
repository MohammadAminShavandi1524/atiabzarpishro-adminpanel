"use client";

import { FieldError } from "react-hook-form";

import { CustomSelect } from "@/components/ui/custom-select";

interface CategoryOption {
  label: string;
  value: string;
}

interface CategorySelectProps {
  label: string;
  options: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: FieldError;
}

export const CategorySelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select category...",
  error,
}: CategorySelectProps) => {
  return (
    <CustomSelect
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
    />
  );
};
