const euros = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return `${euros.format(cents / 100)}\u202f€`;
}
