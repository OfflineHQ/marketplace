// EventLocations.tsx

'use client';

import React from 'react';
import type { LocationAddress, EventDateLocation } from '../../types';
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

  const handleClick = (location: LocationAddress) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${location.placeId}`;
    window.open(googleMapsUrl, '_blank');
  };

  const commonLocation = eventDateLocations[0].location;

  const renderLocation = (location: LocationAddress) => {
    if (location.venue) {
      return location.venue;
    }
    return `${location.city}, ${location.country}`;
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
          eventDateLocations.map((eventLocation) => (
            <Button
              key={eventLocation.id}
              variant="link"
              className="text-base font-semibold"
              onClick={() => handleClick(eventLocation.location)}
            >
              {detailed
                ? `${
                    eventLocation.location.venue ||
                    eventLocation.location.street
                  }, 
              ${eventLocation.location.city}, ${eventLocation.location.state}, 
              ${eventLocation.location.country}, 
              ${eventLocation.location.postalCode}`
                : renderLocation(eventLocation.location)}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
