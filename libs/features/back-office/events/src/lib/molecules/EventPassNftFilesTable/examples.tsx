import {
  Currency_Enum,
  EventPassNftContractType_Enum,
} from '@gql/shared/types';
import { EventPassNftFilesTableProps } from './EventPassNftFilesTable';

export const eventPassNftFiles = [
  {
    filePath: '/local/path/to/file1',
    fileName: 'file1',
    fileUrl: 'https://file1',
    lastModified: 1623345600000,
    size: 100,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file2',
    fileName: 'file2',
    fileUrl: 'https://file2',
    lastModified: 1623345600001,
    size: 200,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file3',
    fileName: 'file3',
    fileUrl: 'https://file3',
    lastModified: 1623345600002,
    size: 300,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file4',
    fileName: 'file4',
    fileUrl: 'https://file4',
    lastModified: 1623345600003,
    size: 400,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file5',
    fileName: 'file5',
    fileUrl: 'https://file5',
    lastModified: 1623345600004,
    size: 500,
    type: 'File',
  },
  {
    filePath: '/local/path/to/file6',
    fileName: 'file6',
    fileUrl: 'https://file6',
    lastModified: 1623345600005,
    size: 600,
    type: 'File',
  },
];

export const eventPassNftVIPWithContract: EventPassNftFilesTableProps['eventPass'] =
  {
    name: 'VIP Access',
    id: 'pass-1001',
    description: 'Exclusive VIP pass with backstage access and premium seating',
    nftName: 'EpicFestVIP',
    nftDescription:
      'Limited Edition NFT for VIP attendees of Epic Music Festival',
    nftImage: {
      url: 'https://picsum.photos/id/620/350/350',
    },
    passOptions: [],
    passAmount: {
      maxAmount: 100,
      timeBeforeDelete: 3600,
    },
    passPricing: {
      amount: 42500,
      currency: Currency_Enum.Eur,
    },
    eventPassNftContract: {
      contractAddress: '0x123456789abcdef',
      type: EventPassNftContractType_Enum.Normal,
      eventPassId: 'pass-1001',
      isDelayedRevealed: false,
    },
  };

export const eventPassNftVipNoContractDelayedReveal: EventPassNftFilesTableProps['eventPass'] =
  {
    name: 'VIP Access',
    id: 'pass-2002',
    description: 'VIP pass to be revealed later',
    nftName: 'DelayedEventVIP',
    nftDescription: 'VIP NFT for Delayed Passes Event to be revealed later',
    nftImage: {
      url: 'https://picsum.photos/id/623/350/350',
    },
    passOptions: [],
    passAmount: {
      maxAmount: 100,
      timeBeforeDelete: 3600,
    },
    passPricing: {
      amount: 28000,
      currency: Currency_Enum.Eur,
    },
    eventPassNftContract: null,
    eventPassDelayedRevealed: {
      name: 'VIP Access Revealed',
      description: 'VIP pass with exclusive benefits',
      nftName: 'RevealedEventVIP',
      nftDescription: 'VIP NFT for Delayed Passes Event',
      nftImage: {
        url: 'https://picsum.photos/id/626/350/350',
      },
      passOptions: [],
    },
  };
