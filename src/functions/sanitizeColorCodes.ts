/**
 * Sanitize fivem color codes
 * @param name
 */
export function sanitizeColorCodes(name: string): string {
  return name.replace(/\^(\d)/g, "");
}
