export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!(size >= 1)) {
    throw new RangeError("size must be at least 1");
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function partition<T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const matching: T[] = [];
  const rest: T[] = [];
  for (const item of items) {
    (predicate(item) ? matching : rest).push(item);
  }
  return [matching, rest];
}
