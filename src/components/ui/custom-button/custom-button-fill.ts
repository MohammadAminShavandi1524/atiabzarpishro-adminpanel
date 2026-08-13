import type { CustomButtonVariants } from "./custom-button.types";

export function getCustomButtonFill(intent?: CustomButtonVariants["intent"]) {
  switch (intent) {
    case "destructive":
      return "bg-destructive";

    case "success":
      return "bg-success";

    case "warning":
      return "bg-warning";

    case "info":
      return "bg-info";

    case "secondary":
      return "bg-secondary";

    case "primary":
      return "bg-primary";

    default:
      return "bg-primary";
  }
}
