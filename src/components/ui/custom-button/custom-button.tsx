import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

import { customButtonVariants } from "./custom-button-variants";
import type { CustomButtonProps } from "./custom-button.types";

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,

      contentClassName,

      leftSection,
      rightSection,

      loading = false,
      loadingContent,

      disabled,

      asChild = false,

      holdProgress,

      holdColor,

      children,

      ...props
    },

    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}

        disabled={asChild ? undefined : disabled || loading}

        className={cn(
          "relative overflow-hidden",

          customButtonVariants({
            variant: props.variant,
            intent: props.intent,
            size: props.size,
          }),

          className,
        )}

        {...props}
      >
        {/* Hold Fill */}

        {holdProgress !== undefined && (
          <span
            aria-hidden

            className={cn(
              `pointer-events-none absolute inset-y-0 start-0 z-0 transition-[width] duration-75 ease-linear rtl:start-auto rtl:end-0`,

              holdColor ?? "bg-primary/30",
            )}

            style={{
              width: `${holdProgress}%`,
            }}
          />
        )}

        {/* Button Content */}

        <span
          className={cn(
            `relative z-10 inline-flex items-center justify-center gap-2`,

            loading && "opacity-80",

            contentClassName,
          )}
        >
          {loading ? (
            (loadingContent ?? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ))
          ) : (
            <>
              {leftSection && (
                <span className="inline-flex shrink-0">{leftSection}</span>
              )}

              {children}

              {rightSection && (
                <span className="inline-flex shrink-0">{rightSection}</span>
              )}
            </>
          )}
        </span>
      </Comp>
    );
  },
);

CustomButton.displayName = "CustomButton";

export { CustomButton };
