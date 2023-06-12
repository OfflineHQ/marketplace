import { act, renderHook, cleanup } from '@testing-library/react';
import { usePassPurchaseStore } from './passPurchaseStore';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
} from '@features/organizer/event/examples';

describe('passPurchaseStore', () => {
  afterEach(() => {
    // You can chose to set the store's state to a default value here.
    jest.resetAllMocks();
    cleanup();
  });
  it('updatePass correctly updates the pass when the pass does not exist', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.updatePass({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        pass: passWithMaxAmount,
      });
    });

    expect(
      result.current.getPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toEqual([passWithMaxAmount]);
  });

  it('updatePass correctly updates an existing pass', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const newPass = { ...passWithMaxAmount, numTickets: 5 };

    act(() => {
      result.current.setPasses({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        newPasses: [passWithMaxAmount],
      });
      result.current.updatePass({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        pass: newPass,
      });
    });

    expect(
      result.current.getPasses({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
      })
    ).toEqual([newPass]);
  });

  it('updatePass removes the pass when numTickets is 0 or less', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const passWithNoTickets = { ...passWithMaxAmount, numTickets: 0 };

    act(() => {
      result.current.setPasses({
        organizerSlug: 'org',
        eventSlug: 'event',
        newPasses: [passWithMaxAmount],
      });
      result.current.updatePass({
        organizerSlug: 'org',
        eventSlug: 'event',
        pass: passWithNoTickets,
      });
    });

    expect(
      result.current.getPasses({
        organizerSlug: 'org',
        eventSlug: 'event',
      })
    ).toEqual([]);
  });

  it('updatePass does nothing when numTickets is 0 or less and the pass does not exist', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const passWithNoTickets = { ...passWithMaxAmount, numTickets: 0 };

    act(() => {
      result.current.updatePass({
        organizerSlug: 'nonexistentOrg',
        eventSlug: 'nonexistentEvent',
        pass: passWithNoTickets,
      });
    });

    expect(
      result.current.getPasses({
        organizerSlug: 'nonexistentOrg',
        eventSlug: 'nonexistentEvent',
      })
    ).toBeUndefined();
  });

  it('setPasses correctly sets the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [passWithMaxAmount, passWithMaxAmountPerUser],
      });
    });

    expect(
      result.current.getPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toEqual([passWithMaxAmount, passWithMaxAmountPerUser]);
  });

  it('deletePasses correctly removes the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [passWithMaxAmount],
      });
    });

    act(() => {
      result.current.deletePasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      });
    });

    expect(
      result.current.getPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toBeUndefined();
  });

  it('getPasses correctly retrieves the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [passWithMaxAmount],
      });
    });

    const passes = result.current.getPasses({
      organizerSlug: 'testOrg',
      eventSlug: 'testEvent',
    });

    expect(passes).toEqual([passWithMaxAmount]);
  });

  it('ensure immutability', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const organizerSlug = 'testOrg';
    const eventSlug = 'testEvent';

    act(() => {
      result.current.setPasses({
        organizerSlug,
        eventSlug,
        newPasses: [passWithMaxAmount],
      });
    });

    // Get the initial state of passes
    const initialPasses = result.current.getPasses({
      organizerSlug,
      eventSlug,
    });

    // Update pass
    act(() => {
      result.current.updatePass({
        organizerSlug,
        eventSlug,
        pass: { ...passWithMaxAmount, numTickets: 5 },
      });
    });

    // Check passes after update
    const updatedPasses = result.current.getPasses({
      organizerSlug,
      eventSlug,
    });

    // Check immutability after update
    expect(initialPasses).not.toEqual(updatedPasses);

    // Get state of passes after update for further comparison
    const postUpdatePasses = { ...updatedPasses };

    // Delete passes
    act(() => {
      result.current.deletePasses({
        organizerSlug,
        eventSlug,
      });
    });

    // Check passes after deletion
    const passesAfterDeletion = result.current.getPasses({
      organizerSlug,
      eventSlug,
    });

    // Check immutability after deletion
    expect(postUpdatePasses).not.toEqual(passesAfterDeletion);
  });
});
