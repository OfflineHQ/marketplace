import { useWindowSize } from '@uidotdev/usehooks';

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useScreenSize() {
  const { width: _width } = useWindowSize();
  const width = _width || 0;
  const isSm = width <= screens.sm;
  const isMd = width > screens.sm && width < screens.lg;
  const isLg = width >= screens.lg && width < screens.xl;
  const isXl = width >= screens.xl && width < screens['2xl'];
  const is2xl = width >= screens['2xl'];

  const isMobile = isSm;
  const isTablet = width >= screens.md && width < screens.lg;
  const isDesktop = width >= screens.lg;

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile,
    isTablet,
    isDesktop,
  };
}
