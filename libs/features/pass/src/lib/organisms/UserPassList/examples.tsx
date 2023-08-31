import { sleep } from '@utils';
import {
  UserPassList,
  UserPassListSkeleton,
  UserPassListProps,
} from './UserPassList';
import { SeeDetails, Reveal, Download, Send } from '@ui/icons';
export { eventParameters, eventParameters2 } from '../UserPassEvent/examples';

export function passActions({
  eventPassNft,
  eventPass,
  event,
}: Parameters<UserPassListProps['passActions']>[0]): ReturnType<
  UserPassListProps['passActions']
> {
  const items: ReturnType<UserPassListProps['passActions']> = [
    {
      type: 'item',
      icon: <SeeDetails />,
      text: 'See details of the pass',
      action: () => {
        console.log('See details');
      },
    },
  ];
  if (eventPassNft?.isRevealed) {
    items.push({
      type: 'item',
      icon: <Download />,
      text: 'Download the pass',
      action: async () => {
        await sleep(1000);
        console.log('download pass');
      },
    });
  } else {
    items.push({
      type: 'item',
      icon: <Reveal />,
      text: 'Reveal the pass',
      action: () => {
        console.log('reveal pass');
      },
    });
  }
  items.push({
    type: 'item',
    icon: <Send />,
    text: 'Send the pass',
    disabled: true,
    action: () => {
      console.log('send the pass');
    },
  });
  return items;
}

export const UserPassListExample = (props: UserPassListProps) => {
  return <UserPassList {...props} />;
};

export const UserPassListSkeletonExample = () => {
  return <UserPassListSkeleton />;
};
