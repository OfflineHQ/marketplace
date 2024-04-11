import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const colors = [
  '#FC5C54',
  '#FFD95A',
  '#E95D72',
  '#6A87C8',
  '#5FD0F3',
  '#75C06B',
  '#FFDD86',
  '#5FC6D4',
  '#FF949A',
  '#FF8024',
  '#9BA1A4',
  '#EC66FF',
  '#FF8CBC',
  '#FF9A23',
  '#C5DADB',
  '#A8CE63',
  '#71ABFF',
  '#FFE279',
  '#B6B1B6',
  '#FF6780',
  '#A575FF',
  '#4D82FF',
  '#FFB35A',
  '#FF7F50', // Coral
  '#00CED1', // Dark Turquoise
  '#FF1493', // Deep Pink
  '#00BFFF', // Deep Sky Blue
  '#FFD700', // Gold
  '#9370DB', // Medium Purple
  '#FF4500', // Orange Red
  '#7FFFD4', // Aquamarine
  '#00FA9A', // Medium Spring Green
  '#DC143C', // Crimson
  '#00FF7F', // Spring Green
  '#8A2BE2', // Blue Violet
  '#228B22', // Forest Green
] as const;

export const avatars = [
  { color: colors[0], emoji: '🌶' },
  { color: colors[1], emoji: '🤑' },
  { color: colors[2], emoji: '🐙' },
  { color: colors[3], emoji: '🫐' },
  { color: colors[4], emoji: '🐳' },
  { color: colors[0], emoji: '🤶' },
  { color: colors[5], emoji: '🌲' },
  { color: colors[6], emoji: '🌞' },
  { color: colors[7], emoji: '🐒' },
  { color: colors[8], emoji: '🐵' },
  { color: colors[9], emoji: '🦊' },
  { color: colors[10], emoji: '🐼' },
  { color: colors[11], emoji: '🦄' },
  { color: colors[13], emoji: '🐧' },
  { color: colors[8], emoji: '🦩' },
  { color: colors[14], emoji: '👽' },
  { color: colors[0], emoji: '🎈' },
  { color: colors[8], emoji: '🍉' },
  { color: colors[1], emoji: '🎉' },
  { color: colors[15], emoji: '🐲' },
  { color: colors[16], emoji: '🌎' },
  { color: colors[17], emoji: '🍊' },
  { color: colors[18], emoji: '🐭' },
  { color: colors[19], emoji: '🍣' },
  { color: colors[1], emoji: '🐥' },
  { color: colors[20], emoji: '👾' },
  { color: colors[15], emoji: '🥦' },
  { color: colors[0], emoji: '👹' },
  { color: colors[17], emoji: '🙀' },
  { color: colors[4], emoji: '⛱' },
  { color: colors[21], emoji: '⛵️' },
  { color: colors[17], emoji: '🥳' },
  { color: colors[8], emoji: '🤯' },
  { color: colors[22], emoji: '🤠' },
  { color: colors[23], emoji: '🦜' },
  { color: colors[24], emoji: '🐬' },
  { color: colors[25], emoji: '🦚' },
  { color: colors[26], emoji: '🐋' },
  { color: colors[27], emoji: '🌟' },
  { color: colors[28], emoji: '🍇' },
  { color: colors[29], emoji: '🦖' },
  { color: colors[30], emoji: '🍹' },
  { color: colors[31], emoji: '🐢' },
  { color: colors[32], emoji: '🍒' },
  { color: colors[33], emoji: '🌿' },
  { color: colors[34], emoji: '🔮' },
  { color: colors[35], emoji: '🍀' },
  { color: colors[1], emoji: '📚' },
  { color: colors[2], emoji: '🎨' },
  { color: colors[3], emoji: '🏀' },
  { color: colors[4], emoji: '🏖' },
  { color: colors[5], emoji: '🌿' },
  { color: colors[6], emoji: '☕️' },
  { color: colors[7], emoji: '🐠' },
  { color: colors[9], emoji: '🍕' },
  { color: colors[10], emoji: '🗺' },
  { color: colors[11], emoji: '🎤' },
  { color: colors[12], emoji: '🧩' },
  { color: colors[13], emoji: '🚲' },
  { color: colors[14], emoji: '🌈' },
  { color: colors[15], emoji: '🍃' },
  { color: colors[16], emoji: '🚀' },
  { color: colors[17], emoji: '🌍' },
  { color: colors[18], emoji: '🎧' },
  { color: colors[19], emoji: '🎥' },
  { color: colors[20], emoji: '🎮' },
  { color: colors[21], emoji: '🧠' },
  { color: colors[22], emoji: '🎸' },
  { color: colors[23], emoji: '🌴' },
  { color: colors[24], emoji: '🐚' },
  { color: colors[25], emoji: '💃' },
  { color: colors[26], emoji: '🏞' },
  { color: colors[27], emoji: '🏆' },
  { color: colors[28], emoji: '🎼' },
  { color: colors[29], emoji: '🍳' },
  { color: colors[31], emoji: '🌿' },
  { color: colors[32], emoji: '🎡' },
  { color: colors[33], emoji: '🎯' },
  { color: colors[34], emoji: '🧘' },
  { color: colors[35], emoji: '🌳' },
] as const;

function hashCode(text: string) {
  let hash = 0;
  if (text.length === 0) return hash;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function emojiAvatarForAddress(address: string) {
  const resolvedAddress = typeof address === 'string' ? address : '';
  const avatarIndex = Math.abs(
    hashCode(resolvedAddress.toLowerCase()) % avatars.length,
  );
  return avatars[avatarIndex ?? 0];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  const words = name.split(' ');
  const firstWordInitial = words[0].charAt(0).toUpperCase();
  const lastWordInitial =
    words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : '';

  return firstWordInitial + lastWordInitial;
}
