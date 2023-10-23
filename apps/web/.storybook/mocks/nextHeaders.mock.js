export function cookies() {
  return {
    get: (name) => 'mockCookieValue',
    set: (name, value, options) => null,
  };
}

export function headers() {
  return {
    get: (name) => null,
  };
}
