import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Index');
  return <div className="p-8"></div>;
}
