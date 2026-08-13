import LoginForm from "@/components/login/LoginForm";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";



interface LoginPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      {/* Technical background */}
      <div
        className="text-foreground pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Subtle glow */}
      <div className="bg-custom-primary/10 dark:bg-custom-primary/8 pointer-events-none absolute start-1/2 top-[-240px] size-[580px] -translate-x-1/2 rounded-full blur-[150px]" />

      {/* Login */}
      <LoginForm />
    </div>
  );
}
