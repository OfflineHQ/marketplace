import { AppNavLayout } from '@features/appNav/ui';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { NotFound } from './NotFound';

export const NotFoundExample = () => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <NotFound />
    </AppNavLayout>
  );
};
