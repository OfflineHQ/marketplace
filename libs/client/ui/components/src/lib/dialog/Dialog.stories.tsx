// Dialog.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { fireEvent, screen, userEvent, within } from '@storybook/testing-library';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import { Button } from '../button/Button';
import { TextInput } from '../text-input/TextInput';

const meta = {
  title: 'Organisms/Dialog',
  component: Dialog,
  render: DialogDemo,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function DialogDemo(args: any) {
  return (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile Dialog</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TextInput label="Name" defaultValue="Pedro Duarte" />
          <TextInput label="User name" defaultValue="@peduarte" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const OpenDialogWithFocus: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Edit Profile' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile Dialog');
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

export const CloseDialog: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Edit Profile' });
    await userEvent.click(dialogTrigger);

    const closeButton = screen.getByTestId('dialog-close');
    await fireEvent.click(closeButton);

    const dialogTitle = screen.queryByText('Edit profile Dialog');
    expect(dialogTitle).not.toBeInTheDocument();
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const DialogWithNoHeader: Story = {
  render: () => (
    <Dialog defaultOpen={true}>
      <DialogContent>
        <div className="grid gap-4 py-4">
          <TextInput label="Name" defaultValue="Pedro Duarte" />
          <TextInput label="User name" defaultValue="@peduarte" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const OpenedDialogScrollable: Story = {
  render: () => (
    <Dialog defaultOpen={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long scrollable text dialog</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Be bold
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              Motivate teams to do their best work. Offer best practices to get users
              going in the right direction. Be bold and offer just enough help to get the
              work started, and then get out of the way. Give accurate information so
              users can make educated decisions. Know your user's struggles and desired
              outcomes and give just enough information to let them get where they need to
              go.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Be optimistic
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              Focusing on the details gives people confidence in our products. Weave a
              consistent story across our fabric and be diligent about vocabulary across
              all messaging by being brand conscious across products to create a seamless
              flow across all the things. Let people know that they can jump in and start
              working expecting to find a dependable experience across all the things.
              Keep teams in the loop about what is happening by informing them of relevant
              features, products and opportunities for success. Be on the journey with
              them and highlight the key points that will help them the most - right now.
              Be in the moment by focusing attention on the important bits first.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Be practical, with a wink
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              Keep our own story short and give teams just enough to get moving. Get to
              the point and be direct. Be concise - we tell the story of how we can help,
              but we do it directly and with purpose. Be on the lookout for opportunities
              and be quick to offer a helping hand. At the same time realize that nobody
              likes a nosy neighbor. Give the user just enough to know that something
              awesome is around the corner and then get out of the way. Write clear,
              accurate, and concise text that makes interfaces more usable and consistent
              - and builds trust. We strive to write text that is understandable by
              anyone, anywhere, regardless of their culture or language so that everyone
              feels they are part of the team.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Scroll inside viewport</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    const dialogTitle = await screen.findByText('Long scrollable text dialog');
    expect(dialogTitle).toBeVisible();

    const dialogDescription = await screen.findByText(
      "Make changes to your profile here. Click save when you're done."
    );
    expect(dialogDescription).toBeVisible();

    const dialogScrollableContent = await screen.findByText('Be optimistic');
    expect(dialogScrollableContent).toBeVisible();

    const footerButton = screen.getByRole('button', {
      name: 'Scroll inside viewport',
    });
    expect(footerButton).toBeVisible();
  },
};
