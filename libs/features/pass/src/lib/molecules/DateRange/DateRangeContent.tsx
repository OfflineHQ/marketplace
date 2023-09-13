import { Text } from '@ui/components';

export interface DateRangeContentProps {
  formattedStart: string;
  formattedEnd: string;
  fromText: string;
  toText: string;
}
export const DateRangeContent: React.FC<DateRangeContentProps> = ({
  formattedStart,
  formattedEnd,
  fromText,
  toText,
}) => {
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
