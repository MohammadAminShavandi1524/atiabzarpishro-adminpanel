import { useTranslations } from "next-intl";


export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");

  return (
    <div>not found </div>
  );
}
