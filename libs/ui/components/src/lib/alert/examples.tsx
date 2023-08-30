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
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  );
}

// Success Alert
export function AlertSuccess() {
  return (
    <Alert variant="success">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your operation was successful.</AlertDescription>
    </Alert>
  );
}

// Warning Alert
export function AlertWarning() {
  return (
    <Alert variant="warning">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Your account will expire in 3 days.</AlertDescription>
    </Alert>
  );
}

// Info Alert
export function AlertInfo() {
  return (
    <Alert variant="info">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        New features have been added to your account.
      </AlertDescription>
    </Alert>
  );
}
