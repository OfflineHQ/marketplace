import { renderHook } from '@testing-library/react';
import { useScreenSize } from './useScreenSize';

window.matchMedia = jest.fn().mockImplementation((query) => {
  const minWidthMatch = query.match(/min-width: (\d+)px/);
  const maxWidthMatch = query.match(/max-width: (\d+)px/);
  const minWidth = minWidthMatch ? parseInt(minWidthMatch[1], 10) : 0;
  const maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[1], 10) : Infinity;
  const matches = window.innerWidth >= minWidth && window.innerWidth <= maxWidth;

  return {
    matches,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});

// A utility function to update the window width
function resizeWindow(width: number) {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
}

// Helper function to test screen size booleans
function testScreenSize(width: number, expected: { [key: string]: boolean }) {
  resizeWindow(width);
  const { result } = renderHook(() => useScreenSize());
  Object.entries(expected).forEach(([key, value]) => {
    expect(result.current[key as keyof typeof useScreenSize]).toBe(value);
  });
}

describe('useScreenSize', () => {
  test('returns correct screen size booleans for sm', () => {
    testScreenSize(500, {
      isSm: true,
      isMd: false,
      isLg: false,
      isXl: false,
      is2xl: false,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });
  });
  test('returns correct screen size booleans for md', () => {
    testScreenSize(800, {
      isSm: false,
      isMd: true,
      isLg: false,
      isXl: false,
      is2xl: false,
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    });
  });
  test('returns correct screen size booleans for lg', () => {
    testScreenSize(1024, {
      isSm: false,
      isMd: false,
      isLg: true,
      isXl: false,
      is2xl: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });
  test('returns correct screen size booleans for xl', () => {
    testScreenSize(1420, {
      isSm: false,
      isMd: false,
      isLg: false,
      isXl: true,
      is2xl: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });
  test('returns correct screen size booleans for 2xl', () => {
    testScreenSize(2160, {
      isSm: false,
      isMd: false,
      isLg: false,
      isXl: false,
      is2xl: true,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });
});
