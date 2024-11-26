export function getPingColor(ping: number): string {
  if (ping <= 50) {
    return "green";
  } else if (ping <= 150) {
    return "orange";
  } else {
    return "red";
  }
}
