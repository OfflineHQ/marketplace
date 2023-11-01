import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { ErrorClient, type ErrorProps } from './ErrorClient';

export const ErrorExample = (props: ErrorProps) => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <ErrorClient {...props} />
    </AppNavLayout>
  );
};
