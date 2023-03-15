import { ChakraProvider, localStorageManager } from '@chakra-ui/react';

interface ChakraProps {
  children: React.ReactNode;
}

export const Chakra = ({ children }: ChakraProps) => {
  return (
    <ChakraProvider colorModeManager={localStorageManager}>{children}</ChakraProvider>
  );
};
