import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  userEvent,
  waitForElementToBeRemoved,
  within,
} from '@storybook/testing-library';
import { delayData } from '@test-utils/functions';
import { Settings } from '@ui/icons';

import { sleep } from '@utils';
import { Button, ButtonSkeleton, type ButtonSkeletonProps } from './Button';
import {
  AllbuttonSizesComponent,
  AllbuttonSizesLoadingComponent,
  AllbuttonSizesWithIconComponent,
  AllbuttonSizesWithIconRightComponent,
  AllbuttonVariantsComponent,
  AllbuttonVariantsDisabledComponent,
  AllbuttonVariantsLoadingComponent,
  AllbuttonVariantsWithIconComponent,
  ButtonDemo,
  sizeOptions,
  variantOptions,
} from './examples';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  render: ButtonDemo,
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: 'radio' },
    },
    size: {
      options: sizeOptions,
      control: { type: 'select' },
    },
    helperText: {
      control: { type: 'text' },
    },
  },
  args: {
    size: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultButton = {
  args: {
    children: 'Button with Click and Loading',
    onClick: () => delayData(1000, null),
  },
  play: async ({ canvasElement, controls }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    // Check that the spinner is present
    expect(screen.queryByRole('status')).toBeInTheDocument();
    await sleep(100);
    await waitForElementToBeRemoved(() => screen.queryByRole('status'));
  },
} satisfies Story;

export const ButtonWithOnlyIcon: Story = {
  args: {
    children: undefined,
    icon: <Settings />,
    variant: 'ghost',
  },
} satisfies Story;

export const ButtonWithIconOnlyAndLoading: Story = {
  args: {
    ...ButtonWithOnlyIcon.args,
    isLoading: true,
  },
} satisfies Story;

const helperText = 'This is a helper text';

export const ButtonWithHelperText = {
  args: {
    ...ButtonWithOnlyIcon.args,
    helperText,
  },
  play: async ({ canvasElement }) => {
    await userEvent.hover(screen.getByRole('button'));
    // Check that the helper text is present
    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes(helperText)
      );
    });
  },
} satisfies Story;

export const AllbuttonVariants = {
  render: AllbuttonVariantsComponent,
  argTypes: {
    variant: {
      control: false,
    },
  },
};

export const AllbuttonSizes = {
  render: AllbuttonSizesComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const AllbuttonVariantsLoading = {
  render: AllbuttonVariantsLoadingComponent,
  args: {
    size: 'default',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

export const AllbuttonSizesLoading = {
  render: AllbuttonSizesLoadingComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const AllbuttonSizesLoadingWithMobile = {
  ...AllbuttonSizesLoading,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: {
      disableSnapshot: true,
    },
  },
};

export const AllbuttonVariantsDisabled = {
  render: AllbuttonVariantsDisabledComponent,
  args: {
    size: 'default',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

export const AllbuttonVariantsWithIcon = {
  render: AllbuttonVariantsWithIconComponent,
  args: {
    size: 'default',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

export const AllbuttonSizesWithIcon = {
  render: AllbuttonSizesWithIconComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const AllbuttonSizesWithIconRight = {
  render: AllbuttonSizesWithIconRightComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const AllButtonSkeletonSizes: Story = {
  render: () => (
    <>
      {sizeOptions.map((size) => (
        <div key={size} className="mb-2 flex">
          <ButtonSkeleton size={size as ButtonSkeletonProps['size']} />
        </div>
      ))}
    </>
  ),
  argTypes: {
    variant: {
      control: false,
    },
  },
};
