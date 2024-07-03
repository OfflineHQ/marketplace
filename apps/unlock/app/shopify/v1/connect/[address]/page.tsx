'use client';

// import { V1Connected } from '@features/unlock/shopify';

interface V1ConnectedPageProps {
  params: {
    address: string;
  };
}

export default function V1ConnectedPage({ params }: V1ConnectedPageProps) {
  return <pre>{JSON.stringify(params, null, 2)}</pre>;
}
