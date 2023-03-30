import './globals.css';
import { Preview } from '@storybook/react';
import { cn } from '@ui/shared';
import { rootLayoutClasses, parameters } from '../../../../storybook.preview.base';

const preview: Preview = {
  decorators: [
    // Root layout classes for all stories
    (Story) => (
      <div className={cn(rootLayoutClasses)}>
        <Story />
      </div>
    ),
  ],
  parameters,
};

export default preview;
