import { renderHook, act, waitFor } from '@testing-library/react';
import { useToast } from './useToast';

describe('useToast', () => {
  it('should add a new toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Test Toast' });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
  });

  it('should dismiss a toast by id', async () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const toast1 = result.current.toast({ title: 'Toast 1' });
      const toast2 = result.current.toast({ title: 'Toast 2' });

      result.current.dismiss(toast1.id);
    });

    await waitFor(() => result.current.toasts.length === 1);

    expect(result.current.toasts[0].title).toBe('Toast 2');
  });

  it('should dismiss all toasts if no id is provided', async () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });

      result.current.dismiss();
    });

    await waitFor(() => result.current.toasts.length === 0);
  });

  it('should not add more than TOAST_LIMIT toasts', () => {
    const { result } = renderHook(() => useToast());
    const TOAST_LIMIT = 3;

    act(() => {
      for (let i = 1; i <= TOAST_LIMIT + 1; i++) {
        result.current.toast({ title: `Toast ${i}` });
      }
    });

    expect(result.current.toasts.length).toBe(TOAST_LIMIT);
  });

  it('should update a toast by id', async () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const toast1 = result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });

      toast1.update({ id: toast1.id, title: 'Updated Toast 1' });
    });

    await waitFor(() => result.current.toasts.length === 2);

    expect(
      result.current.toasts.find((t) => t.title === 'Updated Toast 1')
    ).toBeTruthy();
  });
});
