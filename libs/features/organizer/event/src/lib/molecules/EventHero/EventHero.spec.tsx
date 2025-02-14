import { composeStories } from '@storybook/react';
import { renderWithIntl } from '@test-utils/next-intl';
import * as stories from './EventHero.stories';

const { Default, Loading } = composeStories(stories);

jest.mock('@next/date', () => ({
  EventDatesServer: () => <div>EventDatesServer</div>,
}));
describe('EventHero', () => {
  it('should render successfully Stories', () => {
    const stories = [Default, Loading];
    stories.forEach((Story) => {
      const { baseElement } = renderWithIntl(<Story />);
      expect(baseElement).toBeTruthy();
    });
  });
});
