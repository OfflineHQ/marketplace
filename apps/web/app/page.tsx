// import { Button, Text } from '@ui/components';

// export default async function Page() {
//   return (
//     <>
//       <Button>Server Button</Button>
//     </>
//   );
// }

// Imports
// ========================================================
import React from 'react';
import ConnectWallet from './wallet';

// Page
// ========================================================
export default function Home() {
  // Render
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-medium text-white">Wallet Connection</h1>

      <ConnectWallet />
    </div>
  );
}
