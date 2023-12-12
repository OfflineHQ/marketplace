import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { NotFound } from './NotFound';

export const NotFoundExample = () => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <NotFound />
    </AppNavLayout>
  );
};
