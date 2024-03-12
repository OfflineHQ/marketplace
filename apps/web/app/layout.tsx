import '@web/styles/globals.css';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
const IFrameResizer = dynamic(() => import('./IFrameResizer'), {
  ssr: false,
});

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.

export default function RootLayout({ children }: Props) {
  return <IFrameResizer>{children}</IFrameResizer>;
}
