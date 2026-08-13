import { cva } from "class-variance-authority";

export const customButtonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap",
    "border font-medium",
    "cursor-pointer select-none",
    "transition-[background-color,border-color,color,transform] duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
      },
      intent: {
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        info: "",
        destructive: "",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-10 p-0",
      },
    },
    compoundVariants: [
      // Solid
      {
        variant: "solid",
        intent: "primary",
        class:
          "border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover",
      },
      {
        variant: "solid",
        intent: "secondary",
        class:
          "border-border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      {
        variant: "solid",
        intent: "success",
        class:
          "border-success bg-success text-success-foreground hover:brightness-90",
      },
      {
        variant: "solid",
        intent: "warning",
        class:
          "border-warning bg-warning text-warning-foreground hover:brightness-90",
      },
      {
        variant: "solid",
        intent: "info",
        class: "border-info bg-info text-info-foreground hover:brightness-90",
      },
      {
        variant: "solid",
        intent: "destructive",
        class:
          "border-destructive bg-destructive text-destructive-foreground hover:brightness-90",
      },

      // Soft
      {
        variant: "soft",
        intent: "primary",
        class:
          "border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/15",
      },
      {
        variant: "soft",
        intent: "secondary",
        class:
          "border-border bg-card-secondary text-foreground hover:border-border-secondary hover:bg-card-tertiary",
      },
      {
        variant: "soft",
        intent: "success",
        class:
          "border-success/20 bg-success/10 text-success hover:border-success/30 hover:bg-success/15",
      },
      {
        variant: "soft",
        intent: "warning",
        class:
          "border-warning/20 bg-warning/10 text-warning hover:border-warning/30 hover:bg-warning/15",
      },
      {
        variant: "soft",
        intent: "info",
        class:
          "border-info/20 bg-info/10 text-info hover:border-info/30 hover:bg-info/15",
      },
      {
        variant: "soft",
        intent: "destructive",
        class:
          "border-destructive/20 bg-destructive/10 text-destructive hover:border-destructive/30 hover:bg-destructive/15",
      },

      // Outline
      {
        variant: "outline",
        intent: "primary",
        class:
          "border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
      },
      {
        variant: "outline",
        intent: "secondary",
        class:
          "border-border-secondary bg-transparent text-foreground hover:bg-card-secondary",
      },
      {
        variant: "outline",
        intent: "success",
        class:
          "border-success bg-transparent text-success hover:bg-success hover:text-success-foreground",
      },
      {
        variant: "outline",
        intent: "warning",
        class:
          "border-warning bg-transparent text-warning hover:bg-warning hover:text-warning-foreground",
      },
      {
        variant: "outline",
        intent: "info",
        class:
          "border-info bg-transparent text-info hover:bg-info hover:text-info-foreground",
      },
      {
        variant: "outline",
        intent: "destructive",
        class:
          "border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground",
      },

      // Ghost
      {
        variant: "ghost",
        intent: "primary",
        class: "border-transparent text-primary hover:bg-primary/10",
      },
      {
        variant: "ghost",
        intent: "secondary",
        class: "border-transparent text-foreground hover:bg-card-secondary",
      },
      {
        variant: "ghost",
        intent: "success",
        class: "border-transparent text-success hover:bg-success/10",
      },
      {
        variant: "ghost",
        intent: "warning",
        class: "border-transparent text-warning hover:bg-warning/10",
      },
      {
        variant: "ghost",
        intent: "info",
        class: "border-transparent text-info hover:bg-info/10",
      },
      {
        variant: "ghost",
        intent: "destructive",
        class: "border-transparent text-destructive hover:bg-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "solid",
      intent: "primary",
      size: "md",
    },
  },
);
