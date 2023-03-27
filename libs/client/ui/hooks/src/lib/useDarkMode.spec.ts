import { renderHook, act, waitFor } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    document.documentElement.className = '';
  });

  const addDarkModeClass = () => {
    document.documentElement.classList.add('dark');
  };

  const triggerMutation = () => {
    const classList = document.documentElement.classList;
    const newClassList = Array.from(classList);
    document.documentElement.setAttribute('class', newClassList.join(' '));
  };

  it('should initialize with dark mode on', () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current).toBe(true);
  });
  it('should update isDark when the dark class is added to the document element', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      addDarkModeClass();
      triggerMutation();
    });

    expect(result.current).toBe(true);
  });
});
