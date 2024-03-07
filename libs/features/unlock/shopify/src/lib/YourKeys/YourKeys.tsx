import { KeyRequiredProps } from '../KeyRequired/KeyRequired';

interface OwnedKeysProps extends Omit<KeyRequiredProps, 'isOwned'> {}

export interface YourKeysProps {}

export function YourKeys(props: YourKeysProps) {
  return (
    <div>
      <h1>Welcome to YourKeys!</h1>
    </div>
  );
}
