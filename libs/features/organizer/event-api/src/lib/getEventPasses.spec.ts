import { adminSdk } from '@gql/admin/api';
import { EventStatus_Enum } from '@gql/shared/types';
import { getEventPasses } from './getEventPasses';

// Mock the adminSdk
jest.mock('@gql/admin/api');

const mockAdminSdk = adminSdk as jest.Mocked<typeof adminSdk>;

describe('getEventPasses', () => {
  it('returns undefined if the event status is not published', async () => {
    mockAdminSdk.GetEventParametersAndEventPasses.mockResolvedValue({
      event: {
        eventParameters: {
          status: EventStatus_Enum.Draft,
        },
      },
      eventPasses: [],
    });

    const result = await getEventPasses({ eventSlug: 'test', locale: 'en' });
    expect(result).toBeUndefined();
  });

  it('returns the event passes data if the event status is published', async () => {
    const mockEventPassesData = {
      event: {
        eventParameters: {
          status: EventStatus_Enum.Published,
        },
      },
      eventPasses: [{ id: '1', name: 'Test Pass' }],
    };

    mockAdminSdk.GetEventParametersAndEventPasses.mockResolvedValue(
      mockEventPassesData,
    );

    const result = await getEventPasses({ eventSlug: 'test', locale: 'en' });
    expect(result).toEqual(mockEventPassesData);
  });
});
