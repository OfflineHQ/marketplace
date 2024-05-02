import { adminSdk } from '@gql/admin/api';
import { EventStatus_Enum } from '@gql/shared/types';
import { getEventWithPasses } from './getEventWithPasses';

// Mock the adminSdk
jest.mock('@gql/admin/api');

const mockAdminSdk = adminSdk as jest.Mocked<typeof adminSdk>;

describe('getEventWithPasses', () => {
  it('returns undefined if the event status is not published', async () => {
    mockAdminSdk.GetEventWithPasses.mockResolvedValue({
      event: {
        eventParameters: {
          status: EventStatus_Enum.Draft,
        },
      },
    });

    const result = await getEventWithPasses({
      eventSlug: 'test',
      locale: 'en',
    });
    expect(result).toBeUndefined();
  });

  it('returns the event data if the event status is published', async () => {
    const mockEventData = {
      event: {
        name: 'Test Event',
        eventParameters: { status: EventStatus_Enum.Published },
      },
    };
    mockAdminSdk.GetEventWithPasses.mockResolvedValue(mockEventData);

    const result = await getEventWithPasses({
      eventSlug: 'test',
      locale: 'en',
    });
    expect(result).toEqual(mockEventData.event);
  });
});
