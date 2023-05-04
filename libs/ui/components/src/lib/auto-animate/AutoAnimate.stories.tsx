import { AutoAnimate } from './AutoAnimate';
import { AvatarExample, AvatarSkeletonExample } from '../avatar/examples';

const meta = {
  title: 'UI/AutoAnimate',
  component: AutoAnimate,
  argTypes: {
    loading: {
      type: 'boolean',
    },
  },
};

export default meta;

export const Default = {
  render: ({ loading }: { loading: boolean }) => (
    <AutoAnimate>
      {loading ? <AvatarSkeletonExample /> : <AvatarExample />}
    </AutoAnimate>
  ),
  args: {
    loading: false,
  },
};
