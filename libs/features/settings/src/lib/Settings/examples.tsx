import { Settings } from './Settings';
import { WithNoUser, WithNormalUser } from '@features/app-nav/stories';
import { AppNavLayout } from '@features/app-nav';

export const SettingsExample = () => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <Settings />
    </AppNavLayout>
  );
};
