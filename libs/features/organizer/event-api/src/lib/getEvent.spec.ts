import { adminSdk } from '@gql/admin/api';
import { EventStatus_Enum } from '@gql/shared/types';
import { getEvent } from './getEvent';

// Mock the adminSdk
jest.mock('@gql/admin/api');

const mockAdminSdk = adminSdk as jest.Mocked<typeof adminSdk>;

describe('getEvent', () => {
  it('returns undefined if the event status is not published', async () => {
    mockAdminSdk.GetEventWithParametersMinimal.mockResolvedValue({
      event: {
        eventParameters: {
          status: EventStatus_Enum.Draft,
        },
      },
    });

    const result = await getEvent({ eventSlug: 'test', locale: 'en' });
    expect(result).toBeUndefined();
  });

  it('returns the event data if the event status is published', async () => {
    const mockEventData = { event: { name: 'Test Event' } };

    mockAdminSdk.GetEventWithParametersMinimal.mockResolvedValue({
      event: {
        eventParameters: {
          status: EventStatus_Enum.Published,
        },
      },
    });

    mockAdminSdk.GetEvent.mockResolvedValue(mockEventData);

    const result = await getEvent({ eventSlug: 'test', locale: 'en' });
    expect(result).toEqual(mockEventData.event);
  });
});
