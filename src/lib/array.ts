export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
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
