import { Settings } from './Settings';
import { WithNoUser, WithUserEmail } from '@features/app-nav/stories';
import { AppNavLayout } from '@features/app-nav';

export const SettingsExample = () => {
  return (
    <AppNavLayout {...WithUserEmail.args}>
      <Settings />
    </AppNavLayout>
  );
};
