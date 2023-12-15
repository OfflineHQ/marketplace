import type { Organizer } from '@features/organizer/organizer-types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarSkeleton,
  ButtonSkeleton,
  Text,
  TextSkeleton,
} from '@ui/components';
import { getInitials } from '@ui/shared';
import Image from 'next/image';
import { title } from 'process';
import { OrganizerFollowButton } from '../OrganizerFollowButton/OrganizerFollowButton';

export type OrganizerHeroProps = Omit<Organizer, 'description'>;

export const OrganizerHero: React.FC<OrganizerHeroProps> = ({
  name,
  slug,
  image,
  imageClasses,
  heroImage,
  heroImageClasses,
}) => {
  // const t = useTranslations('Organizer.OrganizerHero');

  return (
    <div className="relative mb-2 flex h-52 items-end px-2 md:h-[18.25rem] md:px-6">
      <Image
        className="absolute left-0 top-0 h-40 w-full object-cover md:h-60"
        src={heroImage?.url || '/image-placeholder.svg'}
        height="240"
        width="1920"
        style={{
          aspectRatio: '1920/240',
          objectFit: 'cover',
        }}
        alt={title}
      />
      <div className="distinct relative flex max-w-fit items-center rounded-full bg-distinct p-2 opacity-90">
        <Avatar size="xl" className="m-1">
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
          <AvatarImage src={image?.url} className={imageClasses as string} />
        </Avatar>
        <div className="ml-2 mr-4 flex-col md:space-y-1">
          <Text variant="h2">{name}</Text>
          <OrganizerFollowButton name={name} slug={slug} variant="ghost" />
        </div>
      </div>
    </div>
  );
};

export const OrganizerHeroSkeleton: React.FC = () => (
  <div className="relative mb-2 flex h-52 items-end px-2 md:h-[18.25rem] md:px-6">
    <div className="absolute left-0 top-0 h-40 w-full animate-pulse bg-image object-cover dark:bg-image md:h-60"></div>
    <div className="distinct relative flex max-w-fit items-center rounded-full bg-skeleton p-2 opacity-90">
      <AvatarSkeleton size="xl" className="m-1" />
      <div className="ml-2 mr-4 flex-col space-y-2 md:space-y-4">
        <TextSkeleton variant="h2" />
        <ButtonSkeleton size="sm"></ButtonSkeleton>
      </div>
    </div>
  </div>
);
