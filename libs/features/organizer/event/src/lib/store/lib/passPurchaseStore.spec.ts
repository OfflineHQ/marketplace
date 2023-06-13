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
  it('updatePassCart correctly updates the pass when the pass does not exist', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.updatePassCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        pass: passWithMaxAmount,
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toEqual([passWithMaxAmount]);
  });

  it('updatePassCart correctly updates an existing pass', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const newPass = { ...passWithMaxAmount, numTickets: 5 };

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        newPasses: [passWithMaxAmount],
      });
      result.current.updatePassCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        pass: newPass,
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
      })
    ).toEqual([newPass]);
  });

  it('setPasses assigns numTickets to 0 when a new pass is not in the current pass list', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const newPass = { ...passWithMaxAmount };

    act(() => {
      result.current.setPasses({
        organizerSlug: 'newOrg',
        eventSlug: 'newEvent',
        passes: [newPass],
      });
    });

    const passesCart = result.current.getPasses({
      organizerSlug: 'newOrg',
      eventSlug: 'newEvent',
    });

    expect(passesCart).toEqual([{ ...newPass, numTickets: 0 }]);
  });

  it('setPasses correctly sets the passes without numTickets being overriden', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const existingPass = { ...passWithMaxAmount, numTickets: 5 };
    const newPass = { ...passWithMaxAmount, numTickets: 0 };

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        newPasses: [existingPass],
      });
      result.current.setPasses({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        passes: [newPass],
      });
    });

    const passes = result.current.getPasses({
      organizerSlug: 'existingOrg',
      eventSlug: 'existingEvent',
    });

    expect(passes).toEqual([{ ...newPass, numTickets: 5 }]);
  });

  it('getPasses correctly retrieves the passes without numTickets', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const passWithoutTickets = { ...passWithMaxAmount, numTickets: undefined };

    act(() => {
      result.current.setPasses({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        passes: [passWithoutTickets],
      });
    });

    const passes = result.current.getPasses({
      organizerSlug: 'testOrg',
      eventSlug: 'testEvent',
    });

    expect(passes).toEqual([passWithoutTickets]);
  });

  it('updatePassCart does nothing when numTickets is 0 or less and the pass does not exist', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const passWithNoTickets = { ...passWithMaxAmount, numTickets: 0 };

    act(() => {
      result.current.updatePassCart({
        organizerSlug: 'nonexistentOrg',
        eventSlug: 'nonexistentEvent',
        pass: passWithNoTickets,
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'nonexistentOrg',
        eventSlug: 'nonexistentEvent',
      })
    ).toStrictEqual([]);
  });

  it('setPassesCart correctly sets the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [passWithMaxAmount, passWithMaxAmountPerUser],
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toEqual([passWithMaxAmount, passWithMaxAmountPerUser]);
  });

  it('deletePasses correctly removes the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPassesCart({
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
      result.current.getPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toBeUndefined();
  });

  it('getPassesCart correctly retrieves the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [passWithMaxAmount],
      });
    });

    const passes = result.current.getPassesCart({
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
      result.current.setPassesCart({
        organizerSlug,
        eventSlug,
        newPasses: [passWithMaxAmount],
      });
    });

    // Get the initial state of passes
    const initialPasses = result.current.getPassesCart({
      organizerSlug,
      eventSlug,
    });

    // Update pass
    act(() => {
      result.current.updatePassCart({
        organizerSlug,
        eventSlug,
        pass: { ...passWithMaxAmount, numTickets: 5 },
      });
    });

    // Check passes after update
    const updatedPasses = result.current.getPassesCart({
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
    const passesAfterDeletion = result.current.getPassesCart({
      organizerSlug,
      eventSlug,
    });

    // Check immutability after deletion
    expect(postUpdatePasses).not.toEqual(passesAfterDeletion);
  });
  it('getAllPassesCart correctly retrieves all the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const organizerSlug1 = 'org1';
    const eventSlug1 = 'event1';
    const organizerSlug2 = 'org2';
    const eventSlug2 = 'event2';

    const pass1 = { ...passWithMaxAmount, numTickets: 5 };
    const pass2 = { ...passWithMaxAmountPerUser, numTickets: 10 };

    act(() => {
      result.current.setPassesCart({
        organizerSlug: organizerSlug1,
        eventSlug: eventSlug1,
        newPasses: [pass1],
      });
      result.current.setPassesCart({
        organizerSlug: organizerSlug2,
        eventSlug: eventSlug2,
        newPasses: [pass2],
      });
    });

    const allPassesCart = result.current.getAllPassesCart();

    expect(allPassesCart).toEqual({
      [organizerSlug1]: {
        [eventSlug1]: [pass1],
      },
      [organizerSlug2]: {
        [eventSlug2]: [pass2],
      },
    });
  });
});
