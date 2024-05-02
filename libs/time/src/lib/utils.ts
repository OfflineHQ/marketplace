import { addHours, subHours } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';

/**
 * Converts a date to a specified time zone and formats it for display or further processing.
 * @param {Date} date - The date to convert.
 * @param {string} timeZone - The IANA time zone name.
 * @returns {string} - The formatted date string in the specified time zone.
 */
export const convertDateToTimeZone = (date: Date, timeZone: string): string => {
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
};

/**
 * Adds hours to a date in a specific time zone.
 * @param {Date} date - The original date.
 * @param {number} hours - The number of hours to add.
 * @param {string} timeZone - The IANA time zone name.
 * @returns {Date} - The new date with added hours, considered in the specified time zone.
 */
export const addHoursInTimeZone = (
  date: Date,
  hours: number,
  timeZone: string,
): Date => {
  const zonedDate = toZonedTime(date, timeZone);
  const newDate = addHours(zonedDate, hours);
  return toZonedTime(newDate, timeZone); // Convert back if needed, or adjust as per use case
};

/**
 * Subtracts hours from a date in a specific time zone.
 * @param {Date} date - The original date.
 * @param {number} hours - The number of hours to subtract.
 * @param {string} timeZone - The IANA time zone name.
 * @returns {Date} - The new date with subtracted hours, considered in the specified time zone.
 */
export const subHoursInTimeZone = (
  date: Date,
  hours: number,
  timeZone: string,
): Date => {
  const zonedDate = toZonedTime(date, timeZone);
  const newDate = subHours(zonedDate, hours);
  return toZonedTime(newDate, timeZone); // Convert back if needed, or adjust as per use case
};
