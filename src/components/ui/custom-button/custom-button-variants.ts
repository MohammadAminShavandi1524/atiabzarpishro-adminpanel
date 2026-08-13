import { cva } from "class-variance-authority";

export const customButtonVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap",

    // Shape
    "rounded-lg",

    // Typography
    "font-medium",

    // Interaction
    "select-none cursor-pointer",

    // Animation
    "transition-all duration-200",

    // Focus
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring/40",

    // Active
    "active:scale-[0.98]",

    // Disabled
    "disabled:pointer-events-none",
    "disabled:opacity-50",
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
        lg: "h-11 px-5 text-base",
        icon: "size-10 p-0",
      },
    },

    compoundVariants: [
      // =========================
      // SOLID
      // =========================

      {
        variant: "solid",
        intent: "primary",
        class: "bg-primary text-primary-foreground hover:bg-primary-hover",
      },

      {
        variant: "solid",
        intent: "secondary",
        class: "bg-secondary text-secondary-foreground hover:brightness-95",
      },

      {
        variant: "solid",
        intent: "success",
        class: "bg-success text-success-foreground hover:brightness-95",
      },

      {
        variant: "solid",
        intent: "warning",
        class: "bg-warning text-warning-foreground hover:brightness-95",
      },

      {
        variant: "solid",
        intent: "info",
        class: "bg-info text-info-foreground hover:brightness-95",
      },

      {
        variant: "solid",
        intent: "destructive",
        class: "bg-destructive text-destructive-foreground hover:brightness-95",
      },

      // =========================
      // SOFT
      // =========================

      {
        variant: "soft",
        intent: "primary",
        class: "bg-primary/10 text-primary hover:bg-primary/20",
      },

      {
        variant: "soft",
        intent: "secondary",
        class: "bg-secondary text-secondary-foreground hover:brightness-95",
      },

      {
        variant: "soft",
        intent: "success",
        class: "bg-success/10 text-success hover:bg-success/20",
      },

      {
        variant: "soft",
        intent: "warning",
        class: "bg-warning/10 text-warning hover:bg-warning/20",
      },

      {
        variant: "soft",
        intent: "info",
        class: "bg-info/10 text-info hover:bg-info/20",
      },

      {
        variant: "soft",
        intent: "destructive",
        class: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },

      // =========================
      // OUTLINE
      // =========================

      {
        variant: "outline",
        intent: "primary",
        class: "border border-primary text-primary hover:bg-primary/10",
      },

      {
        variant: "outline",
        intent: "secondary",
        class:
          "border border-border bg-background text-foreground hover:bg-accent",
      },

      {
        variant: "outline",
        intent: "success",
        class: "border border-success text-success hover:bg-success/10",
      },

      {
        variant: "outline",
        intent: "warning",
        class: "border border-warning text-warning hover:bg-warning/10",
      },

      {
        variant: "outline",
        intent: "info",
        class: "border border-info text-info hover:bg-info/10",
      },

      {
        variant: "outline",
        intent: "destructive",
        class:
          "border border-destructive text-destructive hover:bg-destructive/10",
      },

      // =========================
      // GHOST
      // =========================

      {
        variant: "ghost",
        intent: "primary",
        class: "text-primary hover:bg-primary/10",
      },

      {
        variant: "ghost",
        intent: "secondary",
        class: "text-foreground hover:bg-accent",
      },

      {
        variant: "ghost",
        intent: "success",
        class: "text-success hover:bg-success/10",
      },

      {
        variant: "ghost",
        intent: "warning",
        class: "text-warning hover:bg-warning/10",
      },

      {
        variant: "ghost",
        intent: "info",
        class: "text-info hover:bg-info/10",
      },

      {
        variant: "ghost",
        intent: "destructive",
        class: "text-destructive hover:bg-destructive/10",
      },
    ],

    defaultVariants: {
      variant: "solid",
      intent: "primary",
      size: "md",
    },
  },
);
