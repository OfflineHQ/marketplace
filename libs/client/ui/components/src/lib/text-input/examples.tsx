import { TextInput, TextInputProps } from './TextInput';

export interface TextInputWithLeftLabelsProps extends TextInputProps {
  className?: string;
}

export const TextInputWithLeftLabels: React.FC<TextInputWithLeftLabelsProps> = ({
  className,
  id,
  ...props
}) => {
  const labels = ['Width', 'Max. width', 'Height', 'Max. height'];
  const defaultValues = ['100%', '300px', '25px', 'none'];

  return (
    <div className={`grid gap-2 ${className}`}>
      {labels.map((label, index) => (
        <TextInput
          {...props}
          key={index}
          label={label}
          leftLabel={true}
          defaultValue={defaultValues[index]}
        />
      ))}
    </div>
  );
};
