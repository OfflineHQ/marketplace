'use client';

import { Organizer } from '@features/organizer/organizer-types';
import { Toggle, ToggleProps } from '@ui/components';
import { Star, StarFill } from '@ui/icons';
import { textColors } from '@ui/shared';
import { debounce } from 'lodash';
import { useState } from 'react';
import { followToggleOrganizer } from '../actions/followToggleOrganizer';

export type OrganizerProps = Pick<Organizer, 'name' | 'slug'>;
export interface OrganizerFollowButtonClientProps
  extends Omit<ToggleProps, 'name'>,
    OrganizerProps {
  text: {
    follow: string;
    unfollow: string;
    helperTextFollow: string;
    helperTextUnfollow: string;
  };
  isConnected: boolean;
}

export const OrganizerFollowButtonClient = ({
  pressed,
  slug,
  text,
  isConnected,
  ...props
}: OrganizerFollowButtonClientProps) => {
  const [checked, setChecked] = useState(pressed);

  // optimistic update
  const handleAction = debounce(async () => {
    setChecked((prev) => !prev);
    try {
      await followToggleOrganizer(slug);
    } catch (error) {
      console.error(error);
      setChecked((prev) => !prev);
    }
  }, 2000);

  return (
    <Toggle
      {...props}
      disabled={!isConnected}
      pressed={checked}
      helperText={checked ? text.helperTextUnfollow : text.helperTextFollow}
      onPressedChange={handleAction}
    >
      <div className={`flex items-center ${textColors.yellow}`}>
        {checked ? <StarFill /> : <Star />}
        <span className="ml-2">{checked ? text.unfollow : text.follow}</span>
      </div>
    </Toggle>
  );
};
