"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";
import { useCustomToast } from "@/components/ui/custom-toast";

import AnimatedSections from "@/components/news/AnimatedSections";
import { Tab } from "@/components/news/Tab";
import CategoriesSection from "@/components/news/CategoriesSection";
import NewsHierarchy from "@/components/news/hierarchy/NewsHierarchy";

export type NewsTabs = "categories" | "news";

interface Category {
  id: number;
  name: string;
  lang: "fa" | "en";
}

const Page = () => {
  const t = useTranslations("news");
  const toast = useCustomToast();

  const [current, setCurrent] = useState<NewsTabs>("categories");
  const [previous, setPrevious] = useState<NewsTabs>("categories");

  const tabOrder: Record<NewsTabs, number> = {
    categories: 0,
    news: 1,
  };

  const direction = tabOrder[current] > tabOrder[previous] ? 1 : -1;

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const [faRes, enRes] = await Promise.all([
        fetch("/api/blog/category/fa"),
        fetch("/api/blog/category/en"),
      ]);

      const faData = await faRes.json();
      const enData = await enRes.json();

      const merged = [
        ...faData.map((item: any) => ({
          ...item,
          lang: "fa" as const,
        })),
        ...enData.map((item: any) => ({
          ...item,
          lang: "en" as const,
        })),
      ].sort((a, b) => a.id - b.id);

      setCategories(merged);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/blog/category/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      toast.success(t("toast.deleteSuccess"));

      getCategories();
    } catch (error) {
      console.error(error);

      toast.error(t("toast.deleteError"));
    }
  };

  const handleTabChange = (value: NewsTabs) => {
    if (value === current) return;

    setPrevious(current);
    setCurrent(value);
  };

  const renderSection = () => {
    switch (current) {
      case "categories":
        return (
          <CategoriesSection categories={categories} onDelete={handleDelete} />
        );

      case "news":
        return <NewsHierarchy />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <HeaderLayout
        title={t("header.title")}
        descrption={t("header.description")}
      />

      <div className="flex flex-1 flex-col px-10 pb-10">
        {/* Tabs */}
        <div className="border-border-secondary mt-8 mb-6 flex border-b">
          <Tab
            label="categories"
            current={current}
            setCurrent={handleTabChange}
          />

          <Tab label="news" current={current} setCurrent={handleTabChange} />
        </div>

        {/* Sections */}
        <AnimatedSections sectionKey={current} direction={direction}>
          {renderSection()}
        </AnimatedSections>
      </div>
    </div>
  );
};

export default Page;
