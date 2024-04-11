import { emojiAvatarForAddress } from './ui-shared';

describe('emojiAvatarForAddress', () => {
  it('returns an object with color and emoji properties', () => {
    const result = emojiAvatarForAddress(
      '0xDE7F309DE0F69C49E7C065BB4AE6DFFE0F5E32F4',
    );
    expect(result).toEqual(
      expect.objectContaining({
        color: expect.any(String),
        emoji: expect.any(String),
      }),
    );
  });
});
