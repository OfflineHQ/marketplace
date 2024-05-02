'use client';

import { Minus, Plus } from '@ui/icons';
import { Button } from '../button/Button';
import { Text } from '../text/Text';

export interface BoundedNumericStepperProps {
  minVal?: number;
  maxVal: number;
  value: number;
  initialValue?: number;
  onChange?: (value: number) => void;
  helperTextDecrement?: string;
  helperTextIncrement?: string;
  isPending?: boolean;
}

export const BoundedNumericStepper: React.FC<BoundedNumericStepperProps> = ({
  minVal = 0,
  maxVal,
  value,
  initialValue = 0,
  onChange,
  helperTextDecrement,
  helperTextIncrement,
  isPending,
}) => {
  const increment = () => {
    const newValue = value + 1;
    if (value < maxVal && onChange) {
      onChange(newValue);
    }
  };

  const decrement = () => {
    if (value > minVal) {
      const newValue = value - 1;
      if (onChange) onChange(newValue);
    }
  };

  return (
    <div>
      {isPending ? (
        <Button isLoading />
      ) : (
        <div className="flex items-center">
          <Button
            icon={<Minus />}
            onClick={decrement}
            disabled={value === minVal}
            helperText={helperTextDecrement}
            variant="outline"
            aria-label="decrement value"
          />
          <Text className="mx-2" variant="h6">
            {value}
          </Text>
          <Button
            icon={<Plus />}
            onClick={increment}
            disabled={value === maxVal}
            helperText={helperTextIncrement}
            variant="outline"
            aria-label="increment value"
          />{' '}
        </div>
      )}
    </div>
  );
};
