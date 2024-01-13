// eslint-disable-next-line import/no-unresolved
import '@next/types';
import { UTCDateMini as _UTCDateMini } from '@date-fns/utc';

export class UTCDateMini extends _UTCDateMini {
  constructor();
  constructor(value: Date | number | string);
  constructor(
    year: number,
    month: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number,
  );
  constructor(args?: any) {
    if (typeof window !== 'undefined' && window?.STORYBOOK_ENV) {
      super(new Date('2023-06-05T00:00:00Z'));
    } else {
      if (args) {
        super(args);
      } else {
        super(new Date()); // use current date if no args provided
      }
    }
  }
}
