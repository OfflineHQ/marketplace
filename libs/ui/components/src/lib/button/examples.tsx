import {
  Button,
  buttonVariants,
  buttonSizes,
  type ButtonProps,
} from './Button';
import { delayData } from '@test-utils/functions';
import { OutlineArrowRight } from '@ui/icons';

export const variantOptions = Object.keys(buttonVariants);
export const sizeOptions = Object.keys(buttonSizes);

export const ButtonDemo = (props: ButtonProps) => (
  <div className="flex">
    <Button {...props} />
  </div>
);

type AllbuttonVariantsComponentProps = {
  size: keyof typeof buttonSizes;
};

export const AllbuttonVariantsComponent: React.FC<
  AllbuttonVariantsComponentProps
> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <ButtonDemo
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
      >
        {variant}
      </ButtonDemo>
    ))}
  </>
);

type AllbuttonSizesComponentProps = {
  variant: keyof typeof buttonVariants;
};

export const AllbuttonSizesComponent: React.FC<
  AllbuttonSizesComponentProps
> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <ButtonDemo
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
      >
        {size}
      </ButtonDemo>
    ))}
  </>
);

export const AllbuttonVariantsLoadingComponent: React.FC<
  AllbuttonVariantsComponentProps
> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <ButtonDemo
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
        onClick={() => delayData(3000, null)}
        isLoading
      >
        {variant} Loading
      </ButtonDemo>
    ))}
  </>
);

export const AllbuttonSizesLoadingComponent: React.FC<
  AllbuttonSizesComponentProps
> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <ButtonDemo
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
        onClick={() => delayData(3000, null)}
        isLoading
      >
        {size} Loading
      </ButtonDemo>
    ))}
  </>
);

export const AllbuttonVariantsDisabledComponent: React.FC<
  AllbuttonVariantsComponentProps
> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <ButtonDemo
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
        disabled
      >
        {variant} Disabled
      </ButtonDemo>
    ))}
  </>
);

export const AllbuttonVariantsWithIconComponent: React.FC<
  AllbuttonVariantsComponentProps
> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <ButtonDemo
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
        icon={<OutlineArrowRight />}
      >
        {variant} with Icon
      </ButtonDemo>
    ))}
  </>
);

export const AllbuttonSizesWithIconComponent: React.FC<
  AllbuttonSizesComponentProps
> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <ButtonDemo
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
        icon={<OutlineArrowRight />}
      >
        {size} with Icon
      </ButtonDemo>
    ))}
  </>
);

export const AllbuttonSizesWithIconRightComponent: React.FC<
  AllbuttonSizesComponentProps
> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <ButtonDemo
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
        iconRight={<OutlineArrowRight />}
      >
        {size} with Icon Right
      </ButtonDemo>
    ))}
  </>
);
