import { Settings } from './Settings';
import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';

export const SettingsExample = () => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <Settings />
    </AppNavLayout>
  );
};
