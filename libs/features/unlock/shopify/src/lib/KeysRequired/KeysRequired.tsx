import { KeyRequired, KeyRequiredProps } from '../KeyRequired/KeyRequired';
import { KeySeparator } from '../KeySeparator/KeySeparator';

export interface KeysRequiredProps {
  keys: KeyRequiredProps[];
  separatorText?: string;
}

export function KeysRequired({ keys, separatorText }: KeysRequiredProps) {
  if (!keys || !keys.length) return null;
  return (
    <div className="flex flex-col space-y-2">
      {keys.map((key, index) => (
        <>
          <KeyRequired key={key.name} {...key} />
          {index < keys.length - 1 && separatorText && (
            <KeySeparator separatorText={separatorText} />
          )}
        </>
      ))}
    </div>
  );
}
