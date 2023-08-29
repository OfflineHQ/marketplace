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

  const renderDetailedLocation = (locationAddress: LocationAddress) => {
    const locationParts = [
      locationAddress.venue,
      locationAddress.street,
      locationAddress.city,
      locationAddress.state,
      locationAddress.country,
      locationAddress.postalCode,
    ].filter(Boolean);
    return locationParts.join(', ');
  };

  return (
    <div className="flex flex-1 items-center space-x-1">
      <LocationIcon size="lg" flex />
      <div className="flex flex-1 flex-col items-start space-y-0">
        {eventDateLocations.length > 1 && !detailed ? (
          <Button
            variant="link"
            className="h-auto text-base font-semibold"
            onClick={() => handleClick(commonLocation)}
          >
            {renderLocation(commonLocation)}
          </Button>
        ) : (
          eventDateLocations.map((eventLocation, index) => (
            <Button
              variant="link"
              className="h-auto text-left text-base font-semibold"
              key={index}
              onClick={() => handleClick(eventLocation.locationAddress)}
            >
              {detailed
                ? renderDetailedLocation(eventLocation.locationAddress)
                : renderLocation(eventLocation.locationAddress)}
            </Button>
          ))
        )}
      </div>
    </div>
  );

  // ... other code
};
