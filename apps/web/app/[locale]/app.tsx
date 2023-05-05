import Header from '@web/components/header/Header';
import { Toaster } from '@ui/components';
import { AuthProvider } from '@client/auth';

interface AppProps {
  children: React.ReactNode;
}

export default function App({ children }: AppProps) {
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
