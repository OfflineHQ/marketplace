// EventLocations.tsx
import React from 'react';
import type { Location, EventDateLocation } from '../../types';
import { Location as LocationIcon } from '@ui/icons';
export interface EventLocationsProps {
  locations: EventDateLocation[];
  detailed?: boolean;
}

export const EventLocations: React.FC<EventLocationsProps> = ({
  locations,
  detailed,
}) => {
  const handleClick = (location: Location) => {
    // Generate a Google Maps URL using the placeId.
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${location.placeId}`;
    // Open the URL in a new tab or window.
    window.open(googleMapsUrl, '_blank');
  };

  const commonLocation = locations[0].location;

  return (
    <div className="flex justify-center space-x-1">
      <LocationIcon />
      <div className="flex flex-col space-y-1">
        {locations.length > 1 && !detailed ? (
          <p onClick={() => handleClick(commonLocation)}>
            {commonLocation.city}, {commonLocation.country}
          </p>
        ) : (
          locations.map((eventLocation) => (
            <p
              key={eventLocation.id}
              onClick={() => handleClick(eventLocation.location)}
            >
              {eventLocation.location.street}, {eventLocation.location.city},{' '}
              {eventLocation.location.state}, {eventLocation.location.country},{' '}
              {eventLocation.location.postalCode}
            </p>
          ))
        )}
      </div>
    </div>
  );
};
