import { Star, StarFill } from '@ui/icons';
import { textColors } from '@ui/shared';
import { useState } from 'react';
import { Toggle, ToggleProps } from './Toggle';

export const ToggleDemo = ({ pressed, ...props }: ToggleProps) => {
  const [checked, setChecked] = useState(pressed);
  return (
    <div>
      <Toggle
        {...props}
        pressed={checked}
        helperText={checked ? 'Click to unfollow' : 'Click to follow'}
        onPressedChange={() => setChecked((prev) => !prev)}
      >
        <div className={`flex ${textColors.yellow}`}>
          {checked ? <StarFill /> : <Star />}{' '}
          <span className="ml-2">{checked ? 'UnFollow' : 'Follow'}</span>
        </div>
      </Toggle>
    </div>
  );
};
