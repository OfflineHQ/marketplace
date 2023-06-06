'use client';

import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@client/store';

export const LocalPassList: React.FC = () => {
  const passes = useStore(usePassPurchaseStore, (state) => state.passes);
  return (
    <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(passes || {}).map(([organizerSlug, events]) => (
        <div key={organizerSlug}>
          Organizer: {organizerSlug}
          {Object.entries(events).map(([eventSlug, eventPasses]) => (
            <div key={eventSlug}>
              Event: {eventSlug}
              {eventPasses.map((pass, index) => (
                <div key={index}>
                  Pass: {pass.name} // example if EventPassCart has a property
                  'name'
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
