// Separator.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen } from '@storybook/testing-library';
import { Separator } from './Separator';
import { Label } from '../label/Label';
import { HelperText } from '../helper-text/HelperText';

const meta = {
  title: 'Atoms/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical'],
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UsageExample: Story = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" className="mx-4" />
        <div>Docs</div>
        <Separator orientation="vertical" className="mx-4" />
        <div>Source</div>
      </div>
    </div>
  ),
};
