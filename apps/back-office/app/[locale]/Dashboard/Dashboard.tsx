import type { SafeUser } from '@next/auth';
import nftCollection from '@nft/thirdweb';
import { ExternalProvider } from '@ethersproject/providers';
import EventCard from './EventCard/EventCard';
import { useEffect, useState } from 'react';
import { getEventsFromOrganizerId } from '@features/organizer/event/server';
import { ProfileNavClient } from '../ProfileNavClient/ProfileNavClient';
import EventSection from './EventCard/EventCard';

export interface DashboardProps {
  user: SafeUser;
  provider: ExternalProvider;
}

export function Dashboard(props: DashboardProps) {
  //const name = props.user.name || props.user.eoa;
  //const thirdweb = new nftCollection(props.provider);
  //const [events, setEvents] = useState([]);

  //useEffect(() => {
  //  const getEvents = async () => {
  //    const e = await getEventsFromOrganizerId({
  //      id: 'clizzky8kap2t0bw7wka9a2id',
  //      locale: defaultLocale,
  //    });

  //    console.log(e);
  //  };

  //  getEvents();
  //}, []);

  return (
    <div>
      <ProfileNavClient> </ProfileNavClient>
      <div className="grid grid-cols-1 content-start justify-items-center gap-4">
        <div>Welcome to the Offline dashboard</div>
        <EventSection />
      </div>
    </div>
  );
}
