import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
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

export const FavoriteGhost = {
  args: {
    variant: 'ghost',
  },
} satisfies Story;

export const FavoriteGhostDistinctClicked = {
  ...FavoriteGhost,
  render: (props) => (
    <ToggleDemo {...props} className="distinct w-fit bg-distinct p-3" />
  ),
  play: async () => {
    await userEvent.click(screen.getByRole('button'));
  },
} satisfies Story;
