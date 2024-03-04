import { Card, CardContent, CardFooter, CardHeader } from '@ui/components';

interface ShopifyCardProps {
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
    <Card>
      {header}
      <CardHeader>{header}</CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
};
