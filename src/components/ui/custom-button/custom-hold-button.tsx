import * as React from "react";

import { cn } from "@/lib/utils";

import { CustomButton } from "./custom-button";

import type { CustomHoldButtonProps } from "./custom-button.types";

import { useHold } from "./use-hold-button";

const CustomHoldButton = React.forwardRef<
  HTMLButtonElement,
  CustomHoldButtonProps
>(
  (
    {
      children,

      duration = 1200,

      onComplete,

      onHoldStart,

      onHoldEnd,

      onCancel,

      autoReset = true,

      resetOnLeave = true,

      overlayClassName,

      className,

      intent,

      ...props
    },

    ref,
  ) => {
    const {
      progress,

      start,

      stop,
    } = useHold({
      duration,

      onComplete,

      onHoldStart,

      onHoldEnd,

      onCancel,

      autoReset,
    });

    const holdColor = cn(
      {
        destructive: "bg-red-500/30",
        success: "bg-green-500/30",
        warning: "bg-yellow-500/30",
        info: "bg-sky-500/30",
        primary: "bg-primary/30",
        secondary: "bg-secondary/40",
      }[intent ?? "primary"],
    );

    const handlePointerDown = (
      event: React.PointerEvent<HTMLButtonElement>,
    ) => {
      event.currentTarget.setPointerCapture(event.pointerId);

      start();
    };

    return (
      <CustomButton
        ref={ref}

        holdProgress={progress}

        holdColor={cn(holdColor, overlayClassName)}

        className={cn(className)}

        intent={intent}

        {...props}

        onPointerDown={handlePointerDown}

        onPointerUp={stop}

        onPointerCancel={stop}

        onPointerLeave={resetOnLeave ? stop : undefined}
      >
        {children}
      </CustomButton>
    );
  },
);

CustomHoldButton.displayName = "CustomHoldButton";

export { CustomHoldButton };
