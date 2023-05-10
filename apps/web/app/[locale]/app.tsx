import Header from '@features/header/ui/server';
import { Toaster } from '@ui/components';
import { AuthProvider } from '@client/auth';
import { useTranslations } from 'next-intl';

interface AppProps {
  children: React.ReactNode;
}

export default function App({ children }: AppProps) {
  const t = useTranslations('Header');
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
      <Toaster />
    </AuthProvider>
  );
}
