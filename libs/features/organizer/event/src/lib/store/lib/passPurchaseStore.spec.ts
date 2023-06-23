import { act, renderHook, cleanup } from '@testing-library/react';
import { usePassPurchaseStore } from './passPurchaseStore';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
} from '@features/organizer/event/examples';

describe('passPurchaseStore', () => {
  afterEach(() => {
    jest.resetAllMocks();
    const { result } = renderHook(() => usePassPurchaseStore());
    result.current.resetPasses();
    cleanup();
  });

  const pass1 = { id: 'dummy', amount: 5 };
  const pass2 = { id: 'dummy2', amount: 10 };
  const passWithNoTickets = { id: 'dummy3', amount: 0 };
  const passData1 = {
    ...passWithMaxAmount,
    id: pass1.id,
  };
  const passData2 = {
    ...passWithMaxAmountPerUser,
    id: pass2.id,
  };

  it('updatePassCart correctly updates the pass when the pass does not exist', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.updatePassCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        pass: pass1,
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toEqual([pass1]);
  });

  it('updatePassCart correctly updates an existing pass', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        newPasses: [pass1],
      });
      result.current.updatePassCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
        pass: pass1,
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'existingOrg',
        eventSlug: 'existingEvent',
      })
    ).toEqual([pass1]);
  });

  it('updatePassCart does nothing when amount is 0 or less and the pass does not exist', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

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
        newPasses: [pass1, pass2],
      });
    });

    expect(
      result.current.getPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
      })
    ).toEqual([pass1, pass2]);
  });

  it('deletePassesCart correctly removes the passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [pass1],
      });
    });

    act(() => {
      result.current.deletePassesCart({
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

  it('ensure immutability', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const organizerSlug = 'testOrg';
    const eventSlug = 'testEvent';

    act(() => {
      result.current.setPassesCart({
        organizerSlug,
        eventSlug,
        newPasses: [pass1],
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
        pass: { ...pass1, amount: 1 },
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
      result.current.deletePassesCart({
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

  it('getPassCart correctly retrieves a specific pass', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [pass1, pass2, passWithNoTickets],
      });
    });

    const pass = result.current.getPassCart({
      organizerSlug: 'testOrg',
      eventSlug: 'testEvent',
      eventPassId: pass2.id,
    });

    expect(pass).toEqual(pass2);
  });

  it('getPassData correctly retrieves pass data', () => {
    const { result } = renderHook(() => usePassPurchaseStore());
    const passesData = [passWithMaxAmount, passWithMaxAmountPerUser];
    const passData = result.current.getPassData({
      passCartId: passWithMaxAmount.id,
      passesData,
    });

    expect(passData).toEqual(passWithMaxAmount);
  });

  it('getPassesCartTotalPasses correctly counts total passes', () => {
    const { result } = renderHook(() => usePassPurchaseStore());
    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [pass1, pass2],
      });
    });

    const totalPasses = result.current.getPassesCartTotalPasses({
      organizerSlug: 'testOrg',
      eventSlug: 'testEvent',
    });
    expect(totalPasses).toEqual(15);
  });

  it('getPassesCartTotalPrice correctly computes total price', () => {
    const { result } = renderHook(() => usePassPurchaseStore());

    const passesData = [passData1, passData2];
    act(() => {
      result.current.setPassesCart({
        organizerSlug: 'testOrg',
        eventSlug: 'testEvent',
        newPasses: [pass1, pass2],
      });
    });

    const total = result.current.getPassesCartTotalPrice({
      organizerSlug: 'testOrg',
      eventSlug: 'testEvent',
      passesData,
    });

    expect(total).toEqual({
      amount: 3150000,
      currency: 'USD',
    });
  });
});
