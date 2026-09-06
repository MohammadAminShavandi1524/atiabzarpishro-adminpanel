"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import HeaderLayout from "@/components/layout/HeaderLayout";

import AnimatedForm from "@/components/addNews/AnimatedForm";

import RootNewsForm from "@/components/addNews/forms/RootNewsForm";

import { Tab } from "@/components/addNews/Tab";

import CategoryForm from "@/components/addNews/forms/CategoryForm";

import ParentNewsForm from "@/components/addNews/forms/ParentNewsForm";

import NewsForm from "@/components/addNews/forms/NewsForm";

export type NewsTab = "category" | "rootNews" | "parentNews" | "news";

const Page = () => {
  const tHeader = useTranslations("addNews.header");

  const [current, setCurrent] = useState<NewsTab>("category");

  const [previous, setPrevious] = useState<NewsTab>("category");

  const tabOrder: Record<NewsTab, number> = {
    category: 0,
    rootNews: 1,
    parentNews: 2,
    news: 3,
  };

  const direction = tabOrder[current] > tabOrder[previous] ? 1 : -1;

  const handleTabChange = (value: NewsTab) => {
    if (value === current) return;

    setPrevious(current);

    setCurrent(value);
  };

  const renderForm = () => {
    switch (current) {
      case "category":
        return <CategoryForm />;

      case "rootNews":
        return <RootNewsForm />;

      case "parentNews":
        return <ParentNewsForm />;

      case "news":
        return <NewsForm />;

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <HeaderLayout
        title={tHeader(`${current}.title`)}
        descrption={tHeader(`${current}.description`)}
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 flex-1 flex-col overflow-hidden px-8 py-6 xl:px-5 xl:py-5 2xl:px-6">
        {/* Tabs */}
        <div className="shrink-0">
          <div className="border-border-secondary flex items-end justify-between border-b">
            <div className="flex">
              <Tab
                label="category"
                current={current}
                setCurrent={handleTabChange}
              />

              <Tab
                label="rootNews"
                current={current}
                setCurrent={handleTabChange}
              />

              <Tab
                label="parentNews"
                current={current}
                setCurrent={handleTabChange}
              />

              <Tab
                label="news"
                current={current}
                setCurrent={handleTabChange}
              />
            </div>

            <div
              lang="en"
              dir="ltr"
              className="text-muted-foreground 3xl:pb-3 3xl:text-[11px] 3xl:tracking-[0.12em] pb-3 text-[11px] tracking-[0.12em] xl:pb-2.5 xl:text-[9px] xl:tracking-[0.1em] 2xl:text-[10px]"
            >
              ATI / NEWS MANAGEMENT
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="3xl:mt-5 mt-5 flex min-h-0 flex-1 flex-col overflow-hidden xl:mt-4 2xl:mt-4.5">
          <AnimatedForm formKey={current} direction={direction}>
            {renderForm()}
          </AnimatedForm>
        </div>
      </div>
    </div>
  );
};

export default Page;
