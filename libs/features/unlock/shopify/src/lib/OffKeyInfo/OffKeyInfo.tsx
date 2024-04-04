import { OffKeyLogo } from '@features/unlock/app-nav';
import { Key } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { OffKeyState } from '../types';

export interface OffKeyInfoProps {
  state: OffKeyState;
  offKeyName: string;
}

export function OffKeyInfo({ state, offKeyName }: OffKeyInfoProps) {
  const stateToBorderColor = {
    [OffKeyState.Unlocked]: 'border-success-border',
    [OffKeyState.Unlocking]: 'border-primary-border',
    [OffKeyState.Used]: 'border-primary-border',
    [OffKeyState.Locked]: 'border-warning-border',
  };
  const stateToKeyIcon = {
    [OffKeyState.Unlocked]: <Key size="lg" />,
    [OffKeyState.Unlocking]: <Key size="lg" className="animate-bounce" />,
    [OffKeyState.Used]: <Key size="lg" className="rotate-45" />,
    [OffKeyState.Locked]: <Key size="lg" className="rotate-45" />,
  };
  const stateToStatusBackground = {
    [OffKeyState.Unlocked]: 'bg-success',
    [OffKeyState.Unlocking]: 'bg-primary',
    [OffKeyState.Used]: 'bg-secondary',
    [OffKeyState.Locked]: 'bg-warning',
  };

  const stateToMainTextColor = {
    [OffKeyState.Unlocked]: '',
    [OffKeyState.Unlocking]: '',
    [OffKeyState.Used]: 'text-secondary-foreground',
    [OffKeyState.Locked]: '',
  };

  const t = useTranslations('Shopify.OffKeyInfo');

  const stateToStatusText = {
    [OffKeyState.Unlocked]: t('unlocked'),
    [OffKeyState.Unlocking]: t('unlocking'),
    [OffKeyState.Used]: t('used'),
    [OffKeyState.Locked]: t('locked'),
  };

  const stateToStatusTextColor = {
    [OffKeyState.Unlocked]: 'text-background',
    [OffKeyState.Unlocking]: 'text-background',
    [OffKeyState.Used]: 'text-secondary-foreground',
    [OffKeyState.Locked]: 'text-background',
  };

  return (
    <div
      className={`flex items-center border pl-4 ${stateToBorderColor[state]}`}
    >
      <div className={`flex items-center py-2 ${stateToMainTextColor[state]}`}>
        <OffKeyLogo className="size-10" />
        <div className="mx-4 font-medium">{offKeyName}</div>
      </div>
      <div
        className={`flex h-full flex-1 items-center justify-center px-3 ${stateToStatusTextColor[state]} ${stateToStatusBackground[state]}`}
      >
        {stateToKeyIcon[state]}
        <div className="ml-2 font-medium">{stateToStatusText[state]}</div>
      </div>
    </div>
  );
}
