import { Text } from '@ui/components';
import { isSameDay } from 'date-fns';
import { useFormatter } from 'next-intl';

export interface DateRangeContentProps {
  timezone: string;
  format: ReturnType<typeof useFormatter>;
  dateStart: string;
  dateEnd: string;
  fromText: string;
  toText: string;
  fromHourText: string;
  toHourText: string;
}
export const DateRangeContent: React.FC<DateRangeContentProps> = ({
  format,
  timezone,
  dateStart,
  dateEnd,
  fromText,
  toText,
  fromHourText,
  toHourText,
}) => {
  const formattedStart = format.dateTime(new Date(dateStart), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });

  const formattedEnd = format.dateTime(new Date(dateEnd), {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });

  if (isSameDay(new Date(dateStart), new Date(dateEnd))) {
    const formattedDate = format.dateTime(new Date(dateStart), {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    });

    const formattedStart = format.dateTime(new Date(dateStart), {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: timezone,
    });

    const formattedEnd = format.dateTime(new Date(dateEnd), {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: timezone,
    });
    return (
      <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-1 gap-4">
        <Text className="col-auto ml-1 flex w-fit space-x-2 pr-2 text-base font-semibold">
          {formattedDate}
        </Text>
        <div className="col-span-2">
          <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-2 gap-2">
            <div className="col-auto flex w-fit space-x-2 pr-2">
              <Text>{fromHourText}</Text>
            </div>
            <div className="col-span-2 flex space-x-2">
              <Text className="flex space-x-2 text-base font-semibold">
                {formattedStart}
              </Text>
            </div>
            <div className="col-auto flex w-fit space-x-2 pr-2">
              <Text>{toHourText}</Text>
            </div>
            <div className="col-span-2 flex space-x-2">
              <Text className="flex space-x-2 text-base font-semibold">
                {formattedEnd}
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-flow-row-dense grid-cols-4 grid-rows-2 gap-1.5 md:gap-3">
      <div className="col-auto flex w-fit space-x-2 pr-2">
        <Text>{fromText}</Text>
      </div>
      <div className="col-span-3 flex space-x-2">
        <Text className="text-base font-semibold">{formattedStart}</Text>
      </div>
      <div className="col-auto flex w-fit space-x-2 pr-2">
        <Text>{toText}</Text>
      </div>
      <div className="col-span-3 flex space-x-2">
        <Text className="text-base font-semibold">{formattedEnd}</Text>
      </div>
    </div>
  );
};
