import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";

import type { customButtonVariants } from "./custom-button-variants";

export type CustomButtonVariants = VariantProps<typeof customButtonVariants>;

export interface CustomButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    CustomButtonVariants {
  asChild?: boolean;

  leftSection?: ReactNode;

  rightSection?: ReactNode;

  loading?: boolean;

  loadingContent?: ReactNode;

  contentClassName?: string;

  leftSectionClassName?: string;

  rightSectionClassName?: string;

  overlayClassName?: string;

  /**
   * Hold progress (0 - 100)
   */
  holdProgress?: number;

  /**
   * Hold fill color
   */
  holdColor?: string;
}

export interface CustomHoldButtonProps extends Omit<
  CustomButtonProps,
  "onClick"
> {
  duration?: number;

  autoReset?: boolean;

  resetOnLeave?: boolean;

  progress?: number;

  onHoldStart?: () => void;

  onHoldEnd?: () => void;

  onCancel?: () => void;

  onComplete?: () => void | Promise<void>;
}

export interface HoldState {
  progress: number;

  holding: boolean;

  loading: boolean;

  completed: boolean;
}

export interface HoldControls {
  start: () => void;

  stop: () => void;

  reset: () => void;
}

export interface HoldHookReturn extends HoldState, HoldControls {}
