import {
  AppNavLayoutDesktop,
  type AppNavLayoutDesktopProps,
} from './AppNavLayoutDesktop';
import { AppNavLayoutMobile } from './AppNavLayoutMobile';

export interface AppNavLayoutProps extends AppNavLayoutDesktopProps {
  children: React.ReactNode;
}

export function AppNavLayout(props: AppNavLayoutProps) {
  const { children, ...appNavLayout } = props;

  return (
    <div className="flex h-full w-full flex-col-reverse md:flex-col">
      {/* Navigation for larger screens */}
      <AppNavLayoutDesktop {...appNavLayout} />
      <div className="flex h-full w-full md:mb-0">{children}</div>
      {/* Navigation for mobile screens */}
      <AppNavLayoutMobile {...appNavLayout} />
    </div>
  );
}
