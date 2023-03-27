import { Box, Grid, Heading, useBreakpointValue, useColorMode } from '@chakra-ui/react';
import { Alert, Dropdown } from 'flowbite-react';

const SomeText = () => {
  const { colorMode } = useColorMode();
  const textSize = useBreakpointValue({
    base: 'xs',
    sm: 'sm',
  });

  return (
    <Grid gap={2} className="format lg:format-lg">
      <Alert color="info">Alert!</Alert>

      <Dropdown label="Dropdown button">
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Earnings</Dropdown.Item>
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown>
      <h2 className="font-bold underline decoration-indigo-500/30 ">Hello, Next.js!</h2>
      <Heading as="h2" fontSize={{ base: 'lg', sm: '3xl' }}>
        Hello
      </Heading>

      <Box
        backgroundColor={colorMode === 'light' ? 'gray.200' : 'gray.500'}
        padding={4}
        borderRadius={4}
      >
        <Box fontSize={textSize}>
          This is a Next.js app with Chakra-UI and TypeScript setup.
        </Box>
      </Box>
    </Grid>
  );
};

export default SomeText;
