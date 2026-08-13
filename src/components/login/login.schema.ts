import { z } from "zod";

interface LoginValidationMessages {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
}

export const createLoginSchema = ({
  emailRequired,
  emailInvalid,
  passwordRequired,
}: LoginValidationMessages) =>
  z.object({
    email: z.string().trim().min(1, emailRequired).email(emailInvalid),

    password: z.string().min(1, passwordRequired),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
