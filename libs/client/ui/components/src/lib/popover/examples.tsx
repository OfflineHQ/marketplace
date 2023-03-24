import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverHeader,
} from './Popover';
import { Settings } from '@client/ui/icons';
import { Button } from '../button/Button';
import { TextInputWithLeftLabels } from '../text-input/examples';

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="subtle" icon={Settings} />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <TextInputWithLeftLabels label="dummy" size="sm" />
      </PopoverContent>
    </Popover>
  );
}

export function PopoverDemoWithNoHeader() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="subtle" icon={Settings} />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <TextInputWithLeftLabels label="dummy" size="sm" />
      </PopoverContent>
    </Popover>
  );
}
