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
    const { progress, start, stop } = useHold({
      duration,
      onComplete,
      onHoldStart,
      onHoldEnd,
      onCancel,
      autoReset,
    });

    const holdColor = cn(
      {
        destructive: "bg-destructive/30",
        success: "bg-success/30",
        warning: "bg-warning/30",
        info: "bg-info/30",
        primary: "bg-primary/30",
        secondary: "bg-foreground/10",
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
        className={className}
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
