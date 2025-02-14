import { OffKeyLogo } from '@features/unlock/app-nav';
import { OffKeyState } from '@next/iframe';
import { Text } from '@ui/components';
import { Key } from '@ui/icons';

export interface OffKeyInfoProps {
  state: OffKeyState;
  offKeyStatusText: string;
  offKeyName: string;
  className?: string;
}

export function OffKeyInfo({
  state,
  offKeyStatusText,
  offKeyName,
  className,
}: OffKeyInfoProps) {
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

  const stateToStatusTextColor = {
    [OffKeyState.Unlocked]: 'text-background',
    [OffKeyState.Unlocking]: 'text-background',
    [OffKeyState.Used]: 'text-secondary-foreground',
    [OffKeyState.Locked]: 'text-background',
  };

  return (
    <div
      className={`off-key-info flex justify-between border pl-4 ${stateToBorderColor[state]} ${className}`}
    >
      <div className={`flex items-center py-2 ${stateToMainTextColor[state]}`}>
        <OffKeyLogo className="size-auto" />
        <Text className="mx-4 font-medium">{offKeyName}</Text>
      </div>
      <div
        className={`flex min-h-max items-center justify-center px-3 ${stateToStatusTextColor[state]} ${stateToStatusBackground[state]}`}
      >
        {stateToKeyIcon[state]}
        <Text className="ml-2 font-medium">{offKeyStatusText}</Text>
      </div>
    </div>
  );
}
