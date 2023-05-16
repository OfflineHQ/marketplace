'use client';

import { Button } from '../button/Button';
import { Text } from '../text/Text';
import { useState } from 'react';
import { Plus, Minus } from '@ui/icons';

export interface BoundedNumericStepperProps {
  minVal?: number;
  maxVal: number;
  initialValue?: number;
  onChange: (value: number) => void;
  helperTextDecrement?: string;
  helperTextIncrement?: string;
}

export const BoundedNumericStepper: React.FC<BoundedNumericStepperProps> = ({
  minVal = 0,
  maxVal,
  initialValue = 0,
  onChange,
  helperTextDecrement,
  helperTextIncrement,
}) => {
  const [value, setValue] = useState(initialValue);

  const increment = () => {
    if (value < maxVal) {
      const newValue = value + 1;
      setValue(newValue);
      onChange(newValue);
    }
  };

  const decrement = () => {
    if (value > minVal) {
      const newValue = value - 1;
      setValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        icon={Minus}
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
        icon={Plus}
        onClick={increment}
        disabled={value === maxVal}
        helperText={helperTextIncrement}
        variant="outline"
        aria-label="increment value"
      />
    </div>
  );
};
