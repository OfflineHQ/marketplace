import { batchDownloadOrReveal } from './batchDownloadOrReveal';
import { revealPass, downloadPass } from '@features/pass-api';
import { revalidateTag } from 'next/cache';

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('@features/pass-api', () => ({
  revealPass: jest.fn(),
  downloadPass: jest.fn(),
}));

describe('batchDownloadOrReveal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call revealPass for unrevealed eventPassNfts', async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: false },
      { id: '2', isRevealed: true },
    ];

    (revealPass as jest.Mock).mockResolvedValue({});
    (downloadPass as jest.Mock).mockResolvedValue({});

    await batchDownloadOrReveal(eventPassNfts);

    expect(revealPass).toHaveBeenCalledWith('1');
    expect(downloadPass).toHaveBeenCalledWith('2');
    expect(revalidateTag).toHaveBeenCalled();
  });

  it("shouldn't call revalidateTag for downloadPass", async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: true },
      { id: '2', isRevealed: true },
    ];

    (revealPass as jest.Mock).mockResolvedValue({});
    (downloadPass as jest.Mock).mockResolvedValue({});

    await batchDownloadOrReveal(eventPassNfts);

    expect(revealPass).not.toHaveBeenCalled();
    expect(downloadPass).toHaveBeenCalledWith('1');
    expect(downloadPass).toHaveBeenCalledWith('2');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should handle errors from revealPass', async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: false },
      { id: '2', isRevealed: true },
    ];

    const error = new Error('FileNotFound');
    (revealPass as jest.Mock).mockRejectedValue(error);
    (downloadPass as jest.Mock).mockResolvedValue({});

    await expect(batchDownloadOrReveal(eventPassNfts)).rejects.toThrow(
      'FileNotFound'
    );

    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should handle errors from downloadPass', async () => {
    const eventPassNfts = [
      { id: '1', isRevealed: false },
      { id: '2', isRevealed: true },
    ];

    const error = new Error('FileNotFound');
    (revealPass as jest.Mock).mockResolvedValue({});
    (downloadPass as jest.Mock).mockRejectedValue(error);

    await expect(batchDownloadOrReveal(eventPassNfts)).rejects.toThrow(
      'FileNotFound'
    );

    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
