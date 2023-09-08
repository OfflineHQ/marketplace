import { sleep } from '@utils';
import {
  UserPassList,
  UserPassListSkeleton,
  UserPassListProps,
} from './UserPassList';
export { eventParameters, eventParameters2 } from '../UserPassEvent/examples';

export const UserPassListExample = (props: UserPassListProps) => {
  return <UserPassList {...props} />;
};

export const UserPassListSkeletonExample = () => {
  return <UserPassListSkeleton />;
};

export const actionsFunctions = {
  revealPass: async () => {
    await sleep(1000);
  },
  downloadPass: async () => {
    await sleep(1000);
  },
} satisfies UserPassListProps['actionsFunctions'];
