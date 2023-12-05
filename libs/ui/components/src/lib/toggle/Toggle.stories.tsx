import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { Toggle } from './Toggle';
import { ToggleDemo } from './examples';

const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  render: ToggleDemo,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Favorite = {} satisfies Story;

export const FavoritePressed = {
  ...Favorite,
  args: {
    pressed: true,
  },
} satisfies Story;

export const FavoriteWithHelperText = {
  ...Favorite,
  play: async () => {
    await userEvent.hover(screen.getByRole('button'));
    await screen.findAllByText(/click to follow/i);
  },
} satisfies Story;

export const FavoriteDisabled = {
  ...Favorite,
  args: {
    disabled: true,
  },
} satisfies Story;

export const FavoriteHighlight = {
  args: {
    variant: 'highlight',
  },
} satisfies Story;
