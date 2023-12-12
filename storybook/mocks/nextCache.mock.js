export function unstable_cache(fn) {
  return (...args) => {
    return fn(...args);
  };
}

export function revalidatePath() {
  return null;
}

export function revalidateTag() {
  return null;
}
export function uunstable_noStore() {
  return null;
}
