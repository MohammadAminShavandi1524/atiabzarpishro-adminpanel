"use client";

import { useEffect, useState } from "react";

import { ControllerRenderProps, FieldError } from "react-hook-form";
import { useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";

interface RootNews {
  id: number;
  title: string;
}

interface RootNewsSelectProps {
  field: ControllerRenderProps<any, "root_blog">;
  error?: FieldError;
}

const RootNewsSelect = ({ field, error }: RootNewsSelectProps) => {
  const t = useTranslations("addNews");

  const [rootNews, setRootNews] = useState<RootNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRootNews = async () => {
      try {
        const res = await fetch("/api/blog/root", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch root news");
        }

        const data: RootNews[] = await res.json();

        const sortedData = [...data].sort((a, b) => b.id - a.id);

        setRootNews(sortedData);
      } catch (error) {
        console.error("FETCH ROOT NEWS ERROR =>", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRootNews();
  }, []);

  return (
    <CustomSelect
      label={t("forms.parentNews.rootNews")}
      placeholder={
        loading
          ? t("forms.parentNews.loadingRootNews")
          : t("forms.parentNews.rootNewsPlaceholder")
      }
      value={String(field.value || "")}
      onChange={(value) => field.onChange(Number(value))}
      options={rootNews.map((item) => ({
        label: item.title,
        value: String(item.id),
      }))}
      disabled={loading}
      error={error}
    />
  );
};

export default RootNewsSelect;
