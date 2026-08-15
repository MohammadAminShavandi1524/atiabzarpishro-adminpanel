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
  const t = useTranslations("addNews");
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
    <div className="flex flex-1 flex-col">
      <HeaderLayout
        title={tHeader(`${current}.title`)}
        descrption={tHeader(`${current}.description`)}
      />

      <div className="flex flex-1 flex-col px-10 pb-10">
        {/* Tabs */}
        <div className="mt-9">
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
              className="text-muted-foreground pb-3 text-[11px] tracking-[0.12em]"
            >
              ATI / NEWS MANAGEMENT
            </div>
          </div>
        </div>

        {/* Form */}
        <AnimatedForm formKey={current} direction={direction}>
          {renderForm()}
        </AnimatedForm>
      </div>
    </div>
  );
};

export default Page;
