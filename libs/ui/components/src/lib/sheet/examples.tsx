import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetContentProps,
  SheetOverflow,
  SheetOverlay,
  SheetTitleSkeleton,
  SheetDescriptionSkeleton,
} from './Sheet';
import { Button } from '../button/Button';
import { TextInput } from '../text-input/TextInput';
import { Text, TextSkeleton } from '../text/Text';

export const long_text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl.\n\n
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl. Donec auctor, libero eget ultricies tincidunt, nisl nunc aliquam nunc, vitae dignissim nisl nunc ac nisl.\n\n
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\n\n`;

export const SheetDemo: React.FC<SheetContentProps> = ({
  size,
  position,
  backButtonText,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button>Open sheet</button>
      </SheetTrigger>
      <SheetContent
        position={position}
        size={size}
        backButtonText={backButtonText}
        variant="stickyFooter"
      >
        <SheetHeader position={position} size={size}>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <SheetOverflow>
          <div className="grid gap-4 py-4">
            <TextInput label="Name" defaultValue="Pedro Duarte" />
            <TextInput label="User name" defaultValue="@peduarte" />
            <Text variant="p">{long_text}</Text>
          </div>
        </SheetOverflow>
        <SheetOverlay footerHeight="4rem" />
        <SheetFooter variant="sticky">
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const SheetSkeletonDemo: React.FC<SheetContentProps> = ({
  size,
  position,
  backButtonText,
}) => (
  <Sheet open={true}>
    <SheetContent
      variant="stickyFooter"
      backButtonText={backButtonText}
      position={position}
      size={size}
      loading
    >
      <SheetHeader position={position} size={size}>
        <SheetTitleSkeleton />
        <SheetDescriptionSkeleton />
      </SheetHeader>
      <SheetOverflow>
        <div className="grid gap-4 py-4">
          <TextSkeleton variant="p" />
        </div>
      </SheetOverflow>
    </SheetContent>
  </Sheet>
);
