import { defaultLocale } from '@next/i18n';
import { redirect } from 'next/navigation';

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
