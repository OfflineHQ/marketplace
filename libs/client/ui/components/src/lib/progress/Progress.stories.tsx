import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, within } from '@storybook/testing-library';
import { Progress, sizes, variants } from './Progress';

const meta: Meta = {
  title: 'Atoms/Progress',
  component: Progress,
  argTypes: {
    size: {
      options: Object.keys(sizes),
      control: { type: 'select' },
    },
    variant: {
      options: Object.keys(variants),
      control: { type: 'radio' },
    },
  },
};
export default meta;

type ProgressStory = StoryObj<typeof meta>;

const Template: ProgressStory['render'] = (args) => <Progress {...args} />;

export const DefaultProgress: ProgressStory = {
  render: Template,
  args: {
    value: 13,
  },
};

export const AllSizes: ProgressStory = {
  render: (args) => (
    <>
      {Object.keys(sizes).map((size) => (
        <div key={size} className="mb-4">
          <h3 className="mb-2">{size}</h3>
          <Progress {...args} size={size as keyof typeof sizes} />
        </div>
      ))}
    </>
  ),
  args: {
    value: 50,
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const AllVariants: ProgressStory = {
  render: (args) => (
    <>
      {Object.keys(variants).map((variant) => (
        <div key={variant} className="mb-4">
          <h3 className="mb-2">{variant}</h3>
          <Progress {...args} variant={variant as keyof typeof variants} />
        </div>
      ))}
    </>
  ),
  args: {
    value: 50,
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};
