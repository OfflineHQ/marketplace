// TextInput.tsx
import * as React from 'react';
import { Label, LabelProps } from '../label/Label';
import { Input, InputProps } from '../input/Input';
import { HelperText } from '../helper-text/HelperText';

export interface TextInputProps
  extends Omit<LabelProps, keyof React.HTMLAttributes<HTMLLabelElement>>,
    InputProps {
  label: string;
  htmlFor?: string;
  helperText?: React.ReactNode;
}

let idCounter = 0;

const TextInput: React.FC<TextInputProps> = ({
  label,
  htmlFor,
  variant,
  helperText,
  icon,
  rightIcon,
  id,
  className,
  size,
  disabled,
  ...props
}) => {
  const generatedId = id || `text-input-${++idCounter}`;
  const helperTextId = `${generatedId}-helper-text`;

  return (
    <div className="flex flex-col">
      <Label
        htmlFor={htmlFor || generatedId}
        variant={disabled ? 'disabled' : variant}
        className="pb-1 sm:pb-2"
      >
        {label}
      </Label>
      <Input
        {...props}
        disabled={disabled}
        id={htmlFor || generatedId}
        variant={variant}
        icon={icon}
        rightIcon={rightIcon}
        size={size}
        aria-describedby={helperTextId}
      />
      <HelperText id={helperTextId} variant={variant}>
        {helperText}
      </HelperText>
    </div>
  );
};

export { TextInput };
