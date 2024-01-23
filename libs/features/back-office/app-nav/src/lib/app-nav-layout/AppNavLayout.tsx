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
    <div className="size-full flex flex-col-reverse overflow-hidden md:flex-col">
      {/* Navigation for larger screens */}
      <AppNavLayoutDesktop {...appNavLayout} />
      <div className="size-full flex">{children}</div>
      {/* Navigation for mobile screens */}
      <AppNavLayoutMobile {...appNavLayout} />
    </div>
  );
}
