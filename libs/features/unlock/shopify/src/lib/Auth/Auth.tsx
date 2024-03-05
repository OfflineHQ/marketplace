export interface ShopifyAuthProps {
  wcUri?: string;
  address?: string;
}

export function ShopifyAuth({ wcUri, address }: ShopifyAuthProps) {
  return (
    <div>
      <h3>Auth</h3>
      <p>address: {address}</p>
      <p>wcUri: {wcUri}</p>
    </div>
  );
}
