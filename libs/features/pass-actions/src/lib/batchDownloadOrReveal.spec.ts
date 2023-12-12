import * as Bytescale from '@bytescale/sdk';
import { revealPass } from '@features/pass-api';
import { revalidateTag } from 'next/cache';
import { batchDownloadOrReveal } from './batchDownloadOrReveal';

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('@features/pass-api', () => ({
  revealPass: jest.fn(),
}));

jest.mock('@bytescale/sdk', () => ({
  AuthManager: {
    beginAuthSession: jest.fn(),
    endAuthSession: jest.fn(),
  },
  FileApi: jest.fn().mockImplementation(() => ({
    downloadFile: jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob()),
    }),
  })),
}));

describe('batchDownloadOrReveal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call revealPass for unrevealed eventPassNfts and downloadPass for all eventPassNfts', async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: false, tokenId: '1001' },
      { id: '2', isRevealed: true, tokenId: '1002' },
    ];

    (revealPass as jest.Mock).mockResolvedValue({});

    await batchDownloadOrReveal('slug', eventPassNfts);

    expect(revealPass).toHaveBeenCalledWith('1');
  });

  it("shouldn't call revealPass or revalidateTag for already revealed eventPassNfts", async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: true, tokenId: '1001' },
      { id: '2', isRevealed: true, tokenId: '1002' },
    ];

    (revealPass as jest.Mock).mockResolvedValue({});

    await batchDownloadOrReveal('slug', eventPassNfts);

    expect(revealPass).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should handle errors from revealPass', async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: false, tokenId: '1001' },
      { id: '2', isRevealed: true, tokenId: '1002' },
    ];

    const error = new Error('FileNotFound');
    (revealPass as jest.Mock).mockRejectedValue(error);

    await expect(batchDownloadOrReveal('slug', eventPassNfts)).rejects.toThrow(
      'FileNotFound',
    );

    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should call Bytescale.AuthManager.beginAuthSession and Bytescale.AuthManager.endAuthSession', async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: false, tokenId: '1001' },
      { id: '2', isRevealed: true, tokenId: '1002' },
    ];

    (revealPass as jest.Mock).mockResolvedValue({});

    await batchDownloadOrReveal('slug', eventPassNfts);

    expect(Bytescale.AuthManager.beginAuthSession).toHaveBeenCalled();
    expect(Bytescale.AuthManager.endAuthSession).toHaveBeenCalled();
  });
});
