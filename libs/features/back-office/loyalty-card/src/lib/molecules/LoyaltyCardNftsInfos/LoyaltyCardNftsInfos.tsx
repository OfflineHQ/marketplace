import { LoyaltyCardOrganizer } from '@features/back-office/loyalty-card-types';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export interface LoyaltyCardNftsInfosProps {
  loyaltyCard: LoyaltyCardOrganizer;
  title: string;
}

export function LoyaltyCardNftsInfos({
  loyaltyCard,
  title,
}: LoyaltyCardNftsInfosProps) {
  const t = useTranslations('OrganizerLoyaltyCard.Card.LoyaltyCardNftsInfos');
  return (
    <AccordionItem value="nft-infos">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="py-4">
        <div className="grid max-w-lg grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-b border-border py-2 md:border-b-0 md:border-r md:py-0 md:pr-4">
            <p className="font-medium">{t('image')}</p>
            <AspectRatio variant="classic">
              <Image
                className="rounded-sm object-cover"
                src={loyaltyCard?.nftImage?.url || '/image-placeholder.svg'}
                fill
                alt={loyaltyCard.nftName}
              />
            </AspectRatio>
          </div>
          <div className="py-2 md:pl-4">
            <p className="font-medium">{t('name')}</p>
            <p>{loyaltyCard.nftName}</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
