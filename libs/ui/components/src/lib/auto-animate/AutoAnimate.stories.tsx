import { AutoAnimate } from './AutoAnimate';
import { AvatarExample, AvatarLoaderExample } from '../avatar/examples';

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
    <AutoAnimate>{loading ? <AvatarLoaderExample /> : <AvatarExample />}</AutoAnimate>
  ),
  args: {
    loading: false,
  },
};
