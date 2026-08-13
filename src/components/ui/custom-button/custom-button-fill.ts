import type { CustomButtonVariants } from "./custom-button.types";

export function getCustomButtonFill(intent?: CustomButtonVariants["intent"]) {
  switch (intent) {
    case "destructive":
      return "bg-destructive";

    case "success":
      return "bg-green-500";

    case "warning":
      return "bg-yellow-500";

    case "info":
      return "bg-sky-500";

    case "secondary":
      return "bg-secondary";

    case "primary":
      return "bg-primary";

    default:
      return "bg-primary";
  }
}
