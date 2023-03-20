import { expect } from '@storybook/jest';
// Accordion.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent, within } from '@storybook/testing-library';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';

const meta = {
  title: 'Molecules/Accordion',
  component: Accordion,
  render: (args) => <AccordionDemo {...args} />,
  argTypes: {
    collapsible: {
      control: { type: 'boolean' },
    },
  },
  args: {
    collapsible: true,
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

function AccordionDemo(args: any) {
  return (
    <Accordion {...args} className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Default: Story = {
  args: {
    type: 'single',
  },
};

export const OpenAccordionItem: Story = {
  ...Default,
  play: async () => {
    const accordionTrigger = screen.getByRole('button', { name: 'Is it accessible?' });
    await userEvent.click(accordionTrigger);

    const accordionContent = await screen.findByText(
      'Yes. It adheres to the WAI-ARIA design pattern.'
    );
    expect(accordionContent).toBeVisible();

    const accordionItem = accordionContent.closest('[role="region"]');
    expect(accordionItem?.getAttribute('data-state')).toBe('open');
  },
};

export const CloseAccordionItem: Story = {
  ...Default,
  play: async () => {
    const accordionTrigger = screen.getByRole('button', { name: 'Is it accessible?' });
    await userEvent.click(accordionTrigger);
    await userEvent.click(accordionTrigger);

    const accordionItems = screen.getAllByRole('region', { hidden: true });
    expect(accordionItems.length).toBe(3);
  },
};

export const MultipleOpenAccordionItem: Story = {
  args: {
    type: 'multiple',
  },
  play: async () => {
    const accordionTrigger = screen.getByRole('button', { name: 'Is it accessible?' });
    await userEvent.click(accordionTrigger);

    const accordionContent = await screen.findByText(
      'Yes. It adheres to the WAI-ARIA design pattern.'
    );
    expect(accordionContent).toBeVisible();

    const accordionItem = accordionContent.closest('[role="region"]');
    expect(accordionItem?.getAttribute('data-state')).toBe('open');

    const thirdAccordionTrigger = screen.getByRole('button', { name: 'Is it animated?' });
    await userEvent.click(thirdAccordionTrigger);

    const ThirdAccordionContent = await screen.findByText(
      "Yes. It's animated by default, but you can disable it if you prefer."
    );
    expect(ThirdAccordionContent).toBeVisible();

    const thirdAccordionItem = accordionContent.closest('[role="region"]');
    expect(thirdAccordionItem?.getAttribute('data-state')).toBe('open');
  },
};
