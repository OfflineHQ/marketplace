import { OutlineWarning } from '@ui/icons';
import { Alert, AlertDescription, AlertTitle, AlertProps } from './Alert';

export function AlertDemo(props: AlertProps) {
  return (
    <Alert {...props}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}

export function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <OutlineWarning className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  );
}
