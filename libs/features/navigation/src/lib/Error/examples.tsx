import { AppNavLayout } from '@features/app-nav';
import { WithUserEmail } from '@features/app-nav/stories';
import { ErrorClient, type ErrorProps } from './ErrorClient';

export const ErrorExample = (props: ErrorProps) => {
  return (
    <AppNavLayout {...WithUserEmail.args}>
      <ErrorClient {...props} />
    </AppNavLayout>
  );
};
