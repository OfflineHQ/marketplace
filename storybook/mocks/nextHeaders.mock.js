export function cookies() {
  return {
    get: (name) => name,
    set: (name, value, options) => null,
    getAll: () => {
      return {};
    },
    toString: () => {
      const allCookies = {};
      return Object.entries(allCookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
    },
  };
}

export function headers() {
  const headersMap = new Map();
  headersMap.set('set-cookie', 'mockCookieValue');
  return headersMap;
}
