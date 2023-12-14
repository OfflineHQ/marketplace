// AlertDialog.stories.tsx
import { Meta, StoryObj } from '@storybook/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogVariants,
} from './AlertDialog';

const AlertDialogDemo: React.FC<AlertDialogVariants> = ({ variant }) => {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader variant={variant}>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={variant}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const meta = {
  title: 'Organisms/AlertDialog',
  component: AlertDialogHeader,
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['default', 'success', 'destructive'],
    },
  },
  args: {
    variant: 'default',
  },
  render: AlertDialogDemo,
} as Meta<typeof AlertDialogHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAlertDialog: Story = {
  args: {
    variant: 'default',
  },
};

export const SuccessAlertDialog: Story = {
  args: {
    variant: 'success',
  },
};

export const DestructiveAlertDialog: Story = {
  args: {
    variant: 'destructive',
  },
};
