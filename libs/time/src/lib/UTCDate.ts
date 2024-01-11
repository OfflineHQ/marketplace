declare let STORYBOOK_ENV: string;

import { UTCDate as _UTCDate } from '@date-fns/utc';

export class UTCDate extends _UTCDate {
  constructor(date: any) {
    super(STORYBOOK_ENV ? new Date('2023-06-05T00:00:00Z') : date);
  }
}
