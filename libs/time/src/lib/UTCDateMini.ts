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
    if (window?.STORYBOOK_ENV) {
      super(new Date('2023-06-05T00:00:00Z'));
    } else {
      super(args);
    }
  }
}
