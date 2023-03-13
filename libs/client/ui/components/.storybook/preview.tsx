import theme from '@client/ui/theme';
import './globals.css';

export const parameters = {
  chakra: {
    theme,
  },
  darkMode: {
    current: 'dark',
    darkClass: 'dark',
    stylePreview: true,
  },
  backgrounds: { disable: true },
  layout: 'centered',
};

// export const decorators = [
//   (Story: any) => (
//     <Container mt="40px" display="flex" flexWrap="wrap" centerContent gap="4">
//       <Story />
//     </Container>
//   ),
// ];
