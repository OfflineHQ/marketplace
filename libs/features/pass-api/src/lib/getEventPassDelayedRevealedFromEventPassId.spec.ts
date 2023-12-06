import { adminSdk } from '@gql/admin/api';
import { EventPassNftContractType_Enum, Locale } from '@gql/shared/types';
import {
  getEventPassDelayedRevealedFromEventPassId,
  isDelayedRevealed,
} from './getEventPassDelayedRevealedFromEventPassId';

jest.mock('@gql/admin/api');

describe('getEventPassDelayedRevealedFromEventPass', () => {
  describe('isDelayedRevealed', () => {
    // Returns true if eventPassNftContract type is DelayedReveal and isDelayedRevealed is true
    it('should return true when eventPassNftContract type is DelayedReveal and isDelayedRevealed is true', async () => {
      // Mock adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId
      (
        adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
      ).mockResolvedValue({
        eventPassNftContract: [
          {
            type: EventPassNftContractType_Enum.DelayedReveal,
            isDelayedRevealed: true,
          },
        ],
      });

      const result = await isDelayedRevealed('test-id');

      expect(result).toBe(true);
    });

    // Returns false if eventPassNftContract type is not DelayedReveal
    it('should return false when eventPassNftContract type is not DelayedReveal', async () => {
      // Mock adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId
      (
        adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
      ).mockResolvedValue({
        eventPassNftContract: [
          {
            type: EventPassNftContractType_Enum.Normal,
            isDelayedRevealed: true,
          },
        ],
      });

      const result = await isDelayedRevealed('test-id');

      expect(result).toBe(false);
    });

    // Returns false if eventPassNftContract is undefined
    it('should return false when eventPassNftContract is undefined', async () => {
      // Mock adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId
      (
        adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
      ).mockResolvedValue({});

      const result = await isDelayedRevealed('test-id');

      expect(result).toBe(false);
    });

    // Returns false if adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId returns undefined
    it('should return false when adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId returns undefined', async () => {
      // Mock adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId
      (
        adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
      ).mockResolvedValue(undefined);

      const result = await isDelayedRevealed('test-id');

      expect(result).toBe(false);
    });

    // Returns false if eventPassNftContract.isDelayedRevealed is false
    it('should return false when eventPassNftContract.isDelayedRevealed is false', async () => {
      // Mock adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId
      (
        adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
      ).mockResolvedValue({
        eventPassNftContract: [
          {
            type: EventPassNftContractType_Enum.DelayedReveal,
            isDelayedRevealed: false,
          },
        ],
      });

      const result = await isDelayedRevealed('test-id');

      expect(result).toBe(false);
    });
  });

  const mockEventPassId = 'test-id';
  const mockLocale = Locale.En;

  it('should return eventPassDelayedRevealed when isDelayedRevealed returns true', async () => {
    (
      adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
    ).mockResolvedValue({
      eventPassNftContract: [
        {
          type: EventPassNftContractType_Enum.DelayedReveal,
          isDelayedRevealed: true,
        },
      ],
    });
    const mockEventPassDelayedRevealed = {
      name: 'test-name',
    };
    (
      adminSdk.GetEventPassDelayedRevealedFromEventPassId as jest.Mock
    ).mockResolvedValue({
      eventPass: { eventPassDelayedRevealed: mockEventPassDelayedRevealed },
    });

    const result = await getEventPassDelayedRevealedFromEventPassId({
      eventPassId: mockEventPassId,
      locale: mockLocale,
    });

    expect(result).toEqual(mockEventPassDelayedRevealed);
  });

  it('should throw an error when isDelayedRevealed returns false', async () => {
    (
      adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
    ).mockResolvedValue({
      eventPassNftContract: [
        {
          type: EventPassNftContractType_Enum.DelayedReveal,
          isDelayedRevealed: false,
        },
      ],
    });
    await expect(
      getEventPassDelayedRevealedFromEventPassId({
        eventPassId: mockEventPassId,
        locale: mockLocale,
      }),
    ).rejects.toThrow('Event pass is not delayed revealed');
  });

  it('should throw an error when isDelayedRevealed throws an error', async () => {
    const mockError = new Error('Test error');
    (
      adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId as jest.Mock
    ).mockRejectedValueOnce(mockError);
    await expect(
      getEventPassDelayedRevealedFromEventPassId({
        eventPassId: mockEventPassId,
        locale: mockLocale,
      }),
    ).rejects.toThrow(mockError);
  });
});
