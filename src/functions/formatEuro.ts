export function formatEuro(amount: number): string {
  return amount.toLocaleString("de-DE") + " €";
}
