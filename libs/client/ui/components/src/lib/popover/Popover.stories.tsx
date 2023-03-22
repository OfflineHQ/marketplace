import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

import { Button } from '../button/Button';
import { TextInput } from '../text-input/TextInput';
import { TextInputWithLeftLabels } from '../text-input/examples';
import { Settings } from '../icons';

const meta = {
  component: Popover,
  title: 'Molecules/Popover',
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="subtle" icon={Settings} />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Set the dimensions for the layer.
            </p>
          </div>
          <TextInputWithLeftLabels label="dummy" size="sm" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const OpenPopoverWithFocus: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));

    await screen.findByText('Dimensions');
    const dialogContent = screen.getByRole('dialog');
    const allInputs = within(dialogContent).getAllByRole('textbox');
    expect(allInputs[0]).toHaveFocus();
  },
  render: PopoverDemo,
};

export const OpenPopoverAndClose: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));

    await screen.findByText('Dimensions');
    const closeButton = screen.getByTestId('popover-close');
    await fireEvent.click(closeButton);
    const dialogTitle = screen.queryByText('Dimensions');
    expect(dialogTitle).not.toBeInTheDocument();
  },
  render: PopoverDemo,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
