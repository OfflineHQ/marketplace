import { KeyRequiredProps } from './KeyRequired';
export const firstKey = {
  name: 'First Key for brand A',
  description: 'This key is given for free to all users',
} satisfies KeyRequiredProps;

export const secondKey = {
  name: 'Second Key for brand B',
  description: 'This key is given to early supporters of the brand',
} satisfies KeyRequiredProps;
