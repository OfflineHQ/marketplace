import { Card, CardContent, CardFooter } from '@ui/components';

export interface ShopifyCardProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
export const ShopifyCard: React.FC<ShopifyCardProps> = ({
  header,
  footer,
  children,
}) => {
  return (
    <Card className="m-0.5 max-w-xl rounded-xl">
      {header}
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
};
