import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main className={cn("bg-background flex-1 overflow-y-auto p-8", className)}>
      {children}
    </main>
  );
};

export default PageContainer;
