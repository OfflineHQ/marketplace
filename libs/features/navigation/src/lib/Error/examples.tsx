import { AppNavLayout } from '@features/appNav/ui';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { ErrorClient, type ErrorProps } from './ErrorClient';

export const ErrorExample = (props: ErrorProps) => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <ErrorClient {...props} />
    </AppNavLayout>
  );
};
