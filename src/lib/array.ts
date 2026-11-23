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

export function groupBy<T>(items: readonly T[], key: (t: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = Object.create(null);
  for (const item of items) {
    (groups[key(item)] ??= []).push(item);
  }
  return groups;
}

export function zip<A, B>(a: readonly A[], b: readonly B[]): [A, B][] {
  const length = Math.min(a.length, b.length);
  return Array.from({ length }, (_, i): [A, B] => [a[i], b[i]]);
}
