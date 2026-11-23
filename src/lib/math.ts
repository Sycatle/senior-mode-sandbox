export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function variance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = average(values);
  return average(values.map((v) => (v - mean) ** 2));
}

export function mode(values: number[]): number | undefined {
  const counts = new Map<number, number>();
  let best: number | undefined;
  let bestCount = 0;
  for (const v of values) {
    const count = (counts.get(v) ?? 0) + 1;
    counts.set(v, count);
    if (count > bestCount) {
      best = v;
      bestCount = count;
    }
  }
  return best;
}

export function range(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values) - Math.min(...values);
}
