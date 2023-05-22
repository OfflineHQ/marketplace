'use client';
import { useSearchParams } from 'next/navigation';

export const EventClient = () => {
  const searchParams = useSearchParams();
  const purchaseSheet = searchParams.get('purchase');
  return (
    <div>
      <h1>EventClient</h1>
      <p>{JSON.stringify(searchParams)}</p>
    </div>
  );
};
