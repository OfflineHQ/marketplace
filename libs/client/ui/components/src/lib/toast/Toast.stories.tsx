import type { Meta } from '@storybook/react';
import { Toast } from './Toast';

const Story: Meta<typeof Toast> = {
  component: Toast,
  title: 'Toast',
};
export default Story;

export const Primary = {
  args: {},
};
