// EventLocations.tsx

'use client';

import React from 'react';
import type {
  LocationAddress,
  EventDateLocation,
} from '@features/organizer/event-types';
import { Location as LocationIcon } from '@ui/icons';
import { Button } from '@ui/components';

export interface EventLocationsProps {
  eventDateLocations: EventDateLocation[];
  detailed?: boolean;
}

export const EventLocations: React.FC<EventLocationsProps> = ({
  eventDateLocations,
  detailed,
}) => {
  if (!eventDateLocations.length) return null;

  const handleClick = (locationAddress: LocationAddress) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${locationAddress.placeId}`;
    window.open(googleMapsUrl, '_blank');
  };

  const commonLocation = eventDateLocations[0].locationAddress;

  const renderLocation = (locationAddress: LocationAddress) => {
    if (locationAddress.venue) {
      return locationAddress.venue;
    }
    return `${locationAddress.city}, ${locationAddress.country}`;
  };

  return (
    <div className="flex items-center space-x-1">
      <LocationIcon size="lg" flex />
      <div className="flex flex-col items-start space-y-0">
        {eventDateLocations.length > 1 && !detailed ? (
          <Button
            variant="link"
            className="text-base font-semibold"
            onClick={() => handleClick(commonLocation)}
          >
            {renderLocation(commonLocation)}
          </Button>
        ) : (
          eventDateLocations.map((eventLocation, index) => (
            <Button
              key={index}
              variant="link"
              className="text-base font-semibold"
              onClick={() => handleClick(eventLocation.locationAddress)}
            >
              {detailed
                ? `${
                    eventLocation.locationAddress.venue ||
                    eventLocation.locationAddress.street
                  }, 
              ${eventLocation.locationAddress.city}, ${
                    eventLocation.locationAddress.state
                  }, 
              ${eventLocation.locationAddress.country}, 
              ${eventLocation.locationAddress.postalCode}`
                : renderLocation(eventLocation.locationAddress)}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
