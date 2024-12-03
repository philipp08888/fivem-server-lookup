export function getFlagEmoji(locale: string): string {
  const countryCode = locale.split("-")[1].toUpperCase();
  return String.fromCodePoint(
    ...[...countryCode].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  );
}
