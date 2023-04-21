// Sheet.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { fireEvent, screen, userEvent, within } from '@storybook/testing-library';
import { Button } from '../button/Button';
import { TextInput } from '../text-input/TextInput';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  DialogContentProps,
} from './Sheet';

const SheetDemo: React.FC<DialogContentProps> = ({ size, position }) => {
  return (
    <div className="flex flex-col space-y-8">
      <Sheet>
        <SheetTrigger asChild>
          <button>Open sheet</button>
        </SheetTrigger>
        <SheetContent position={position} size={size}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <TextInput label="Name" defaultValue="Pedro Duarte" />
            <TextInput label="User name" defaultValue="@peduarte" />
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const meta = {
  title: 'Organisms/Sheet',
  component: Sheet,
  render: SheetDemo,
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'content', 'full'],
    },
    position: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  args: {
    size: 'default',
    position: 'right',
  },
} as Meta<DialogContentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenedSheetWithFocus: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();

    const dialogDescription = await screen.findByText(
      "Make changes to your profile here. Click save when you're done."
    );
    expect(dialogDescription).toBeVisible();
    // Check if the first TextInput is focused
    const dialogContent = screen.getByRole('dialog');
    const allInputs = within(dialogContent).getAllByRole('textbox');
    expect(allInputs[0]).toHaveFocus();
  },
};

export const CloseSheet: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const closeButton = screen.getByTestId('sheet-close');
    await fireEvent.click(closeButton);

    const dialogTitle = screen.queryByText('Edit profile');
    expect(dialogTitle).not.toBeInTheDocument();
  },
};

export const Large: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    size: 'lg',
  },
};

export const Full: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    size: 'full',
  },
};

export const Content: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    size: 'content',
  },
};

export const Top: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'top',
  },
};

export const Left: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'left',
  },
};

export const Bottom: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'bottom',
  },
};

export const Right: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'right',
  },
};

// Path: libs/ui/components/src/lib/sheet/Sheet.tsx
// Compare this snippet from libs/ui/components/src/lib/dialog/Dialog.tsx:
//
// import { DialogContent, DialogProps }
