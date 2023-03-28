// CheckboxWithText.tsx
import * as React from 'react';
import { Checkbox } from './Checkbox';
import { Label, LabelProps } from '../label/Label';
import { HelperText } from '../helper-text/HelperText';

interface CheckboxWithTextProps {
  label: React.ReactNode;
  disabled?: boolean;
  helperText?: React.ReactNode;
  id?: string;
  htmlFor?: string;
}

let idCounter = 0;

const CheckboxWithText: React.FC<CheckboxWithTextProps> = ({
  label,
  disabled,
  helperText,
  id,
  htmlFor,
  ...props
}) => {
  const generatedId = id || `checkbox-with-text-${++idCounter}`;
  const helperTextId = `${generatedId}-helper-text`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Checkbox
          {...props}
          id={htmlFor || generatedId}
          disabled={disabled}
          aria-describedby={helperTextId}
        />
        <Label
          htmlFor={htmlFor || generatedId}
          className="ml-2 cursor-pointer"
          variant={disabled ? 'disabled' : undefined}
        >
          {label}
        </Label>
      </div>
      {helperText && (
        <HelperText
          id={helperTextId}
          className="ml-6" // Added margin-left to align with the label
          variant={disabled ? 'disabled' : undefined}
        >
          {helperText}
        </HelperText>
      )}
    </div>
  );
};

export { CheckboxWithText };
