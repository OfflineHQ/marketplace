// EventLocations.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { EventLocations } from './EventLocations';
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

const { Default, Detailed, OneLocation } = composeStories(stories);

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
    url = ''; // Reset the url for the next test
  });

  test('renders Detailed EventLocations', () => {
    render(<Detailed />);
    const locationElements = screen.getAllByText(/New York, NY/i);
    expect(locationElements).toHaveLength(2); // Should render two location elements
  });

  test('Detailed location elements open Google Maps URL on click', () => {
    render(<Detailed />);
    const locationElements = screen.getAllByText(/New York, NY/i);
    fireEvent.click(locationElements[0]);
    expect(url).toEqual(
      'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJd8BlQ2BZwokRAFUEcm_qrcA'
    );
    url = ''; // Reset the url for the next test
    fireEvent.click(locationElements[1]);
    expect(url).toEqual(
      'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJhRwB-yFawokRv_x-4eLe3WI'
    );
  });

  test('renders OneLocation EventLocations', () => {
    render(<OneLocation />);
    screen.getByText(/New York, NY/i);
  });

  test('OneLocation location element opens Google Maps URL on click', () => {
    render(<OneLocation />);
    const locationElement = screen.getByText(/New York, NY/i);
    fireEvent.click(locationElement);
    expect(url).toEqual(
      'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJd8BlQ2BZwokRAFUEcm_qrcA'
    );
  });

  it('renders nothing if locations is an empty array', () => {
    const { container } = render(<EventLocations eventDateLocations={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
