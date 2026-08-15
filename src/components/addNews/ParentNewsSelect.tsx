"use client";

import { useEffect, useState } from "react";

import { ControllerRenderProps, FieldError } from "react-hook-form";
import { useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";

interface ParentNews {
  id: number;
  title: string;
}

interface ParentNewsSelectProps {
  field: ControllerRenderProps<any, "parent_blog">;
  error?: FieldError;
}

const ParentNewsSelect = ({ field, error }: ParentNewsSelectProps) => {
  const t = useTranslations("addNews");

  const [parentNews, setParentNews] = useState<ParentNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParentNews = async () => {
      try {
        const res = await fetch("/api/blog/parent", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch parent news");
        }

        const data = await res.json();

        const sortedData = [...data].sort((a, b) => b.id - a.id);

        setParentNews(sortedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentNews();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <CustomSelect
        label={t("forms.news.parentNews")}
        placeholder={
          loading
            ? t("forms.news.loadingParentNews")
            : t("forms.news.parentNewsPlaceholder")
        }
        value={field.value}
        onChange={field.onChange}
        disabled={loading}
        options={parentNews.map((item) => ({
          label: item.title,
          value: item.id,
        }))}
      />

      {error && <p className="px-1 text-xs text-red-400">{error.message}</p>}
    </div>
  );
};

export default ParentNewsSelect;
