import { Avatar, AvatarImage, AvatarFallback, AvatarProps } from './Avatar';

export function AvatarExample(props: AvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src="https://github.com/sebpalluel.png" />
      <AvatarFallback>SP</AvatarFallback>
    </Avatar>
  );
}

export function AvatarFallbackExample(props: AvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src="" />
      <AvatarFallback>FA</AvatarFallback>
    </Avatar>
  );
}
