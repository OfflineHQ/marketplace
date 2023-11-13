'use client';

import { Copy } from '@ui/icons';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { truncateString } from '@utils';
import { useEffect, useState } from 'react';
import { Badge, BadgeProps } from '../badge/Badge';
import { statusVariantIcons } from '../shared/statusVariant';
import { Tooltip } from '../tooltip/Tooltip';

export interface BlockchainAddressProps extends BadgeProps {
  address: string;
  copiedText: string;
  className?: string;
}

const CopiedTooltip = ({ copiedText }: { copiedText: string }) => (
  <span className="flex">
    {
      <statusVariantIcons.success.type
        size="sm"
        color="success"
        className="mr-2"
      />
    }
    {copiedText}
  </span>
);

export const BlockchainAddress = ({
  address,
  copiedText,
  ...props
}: BlockchainAddressProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedText, setHasCopiedText] = useState(false);

  useEffect(() => {
    if (hasCopiedText) {
      const timer = setTimeout(() => {
        setHasCopiedText(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [hasCopiedText]);

  const handleCopy = () => {
    copyToClipboard(address);
    setHasCopiedText(true);
  };

  return (
    <Tooltip
      side="top"
      open={hasCopiedText}
      content={<CopiedTooltip copiedText={copiedText} />}
    >
      <Badge
        icon={<Copy />}
        {...props}
        className="cursor-pointer"
        onClick={handleCopy}
      >
        {truncateString(address, 16)}
      </Badge>
    </Tooltip>
  );
};
