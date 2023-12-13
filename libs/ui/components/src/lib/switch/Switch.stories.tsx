// Switch.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent } from '@storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  render: (props) => (
    <div className="flex">
      <Switch {...props} />
    </div>
  ),
  argTypes: {
    helperText: {
      control: {
        type: 'text',
      },
    },
    leftLabel: {
      control: {
        type: 'text',
      },
    },
    rightLabel: {
      control: {
        type: 'text',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const switchElement = screen.getByRole('switch');

    // Toggle switch on
    fireEvent.click(switchElement);
    await screen.findByRole('switch', { checked: true });

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Toggle switch off
    fireEvent.click(switchElement);
    await screen.findByRole('switch', { checked: false });
  },
};

export const On: Story = {
  args: {
    checked: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const switchElement = screen.getByRole('switch');
    await expect(switchElement).toBeDisabled();
    await expect(switchElement).toHaveAttribute('aria-checked', 'true');
  },
};

export const DisabledOff: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const switchElement = screen.getByRole('switch');
    await expect(switchElement).toBeDisabled();
    await expect(switchElement).toHaveAttribute('aria-checked', 'false');
  },
};

export const LeftLabel: Story = {
  args: {
    leftLabel: 'Off',
  },
};

export const RightLabel: Story = {
  args: {
    rightLabel: 'On',
  },
};

export const BothLabels: Story = {
  args: {
    leftLabel: 'Off',
    rightLabel: 'On',
  },
};

export const DisabledBothLabels: Story = {
  args: {
    leftLabel: 'Off',
    rightLabel: 'On',
    disabled: true,
  },
};

export const BothLabelsWithTooltip: Story = {
  args: {
    leftLabel: 'Off',
    rightLabel: 'On',
    helperText: "I'm a tooltip",
  },
  play: async ({ canvasElement }) => {
    const messageText = "I'm a tooltip";
    userEvent.hover(screen.getByRole('switch'));

    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes(messageText)
      );
    });
  },
};
