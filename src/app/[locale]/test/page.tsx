"use client";

import { useCustomToast } from "@/components/ui/custom-toast";



interface PageProps {}

const Page = ({}: PageProps) => {
  const toast = useCustomToast();

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="border-border bg-card w-full max-w-[700px] border p-8">
        <div className="mb-8">
          <h1 className="text-foreground text-xl font-semibold">
            Custom Toast Test
          </h1>

          <p className="text-muted-foreground mt-2 text-sm">
            تست تمام حالت‌های Toast اختصاصی
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Success */}
          <button
            type="button"
            onClick={() =>
              toast.success(
                "درخواست با موفقیت حذف شد. — Request deleted successfully.",
              )
            }
            className="border-success/30 bg-success/10 text-success hover:bg-success/15 h-12 cursor-pointer border px-5 text-sm font-medium transition-colors"
          >
            Success Toast
          </button>

          {/* Error */}
          <button
            type="button"
            onClick={() =>
              toast.error(
                "حذف درخواست انجام نشد. — Failed to delete the request.",
              )
            }
            className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 h-12 cursor-pointer border px-5 text-sm font-medium transition-colors"
          >
            Error Toast
          </button>

          {/* Warning */}
          <button
            type="button"
            onClick={() =>
              toast.warning(
                "لطفاً اطلاعات را بررسی کنید. — Please check the information.",
              )
            }
            className="border-warning/30 bg-warning/10 text-warning hover:bg-warning/15 h-12 cursor-pointer border px-5 text-sm font-medium transition-colors"
          >
            Warning Toast
          </button>

          {/* Info */}
          <button
            type="button"
            onClick={() =>
              toast.info(
                "اطلاعات جدید در دسترس است. — New information is available.",
              )
            }
            className="border-custom-primary/30 bg-custom-primary/10 text-custom-primary hover:bg-custom-primary/15 h-12 cursor-pointer border px-5 text-sm font-medium transition-colors"
          >
            Info Toast
          </button>
        </div>

        {/* Persian */}
        <div className="border-border mt-8 border-t pt-7">
          <p className="text-muted-foreground mb-4 text-xs font-medium">
            فارسی
          </p>

          <div dir="rtl" className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.success("عملیات با موفقیت انجام شد.")}
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              موفق
            </button>

            <button
              type="button"
              onClick={() => toast.error("خطایی در انجام عملیات رخ داد.")}
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              خطا
            </button>

            <button
              type="button"
              onClick={() =>
                toast.warning("لطفاً اطلاعات وارد شده را بررسی کنید.")
              }
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              هشدار
            </button>

            <button
              type="button"
              onClick={() => toast.info("اطلاعات جدیدی برای شما وجود دارد.")}
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              اطلاعات
            </button>
          </div>
        </div>

        {/* English */}
        <div className="border-border mt-7 border-t pt-7">
          <p className="text-muted-foreground mb-4 text-xs font-medium">
            English
          </p>

          <div dir="ltr" className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.success("Operation completed successfully.")}
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              Success
            </button>

            <button
              type="button"
              onClick={() => toast.error("Something went wrong.")}
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              Error
            </button>

            <button
              type="button"
              onClick={() =>
                toast.warning("Please check the entered information.")
              }
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              Warning
            </button>

            <button
              type="button"
              onClick={() => toast.info("New information is available.")}
              className="border-border hover:bg-secondary h-11 cursor-pointer border px-4 text-sm transition-colors"
            >
              Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
