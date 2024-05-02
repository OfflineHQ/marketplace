import { AppNavLayout } from '@features/app-nav';
import { WithUserEmail } from '@features/app-nav/stories';
import { NotFound } from './NotFound';

export const NotFoundExample = () => {
  return (
    <AppNavLayout {...WithUserEmail.args}>
      <NotFound />
    </AppNavLayout>
  );
};
