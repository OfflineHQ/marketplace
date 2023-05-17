// EventLocations.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './EventLocations.stories';

// Mock window.open function
global.window = Object.create(window);
let url = '';
Object.defineProperty(window, 'open', {
  configurable: true,
  writable: true,
  value: (openUrl: string, target: string) => {
    // Assign the URL to the url variable
    url = openUrl;
  },
});

const { Default } = composeStories(stories);

describe('EventLocations', () => {
  test('renders EventLocations with initial values', () => {
    render(<Default />);
    const locationElements = screen.getAllByText(/New York, USA/i);
    expect(locationElements).toHaveLength(1); // Should render one location element
  });

  test('location element opens Google Maps URL on click', () => {
    render(<Default />);
    const locationElement = screen.getByText(/New York, USA/i);
    fireEvent.click(locationElement);
    expect(url).toEqual(
      'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJd8BlQ2BZwokRAFUEcm_qrcA'
    );
  });
});
