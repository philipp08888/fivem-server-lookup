// TODO: Check which headers are necessary
export const defaultClientHeaders: Record<string, string> = {
  accept: "*/*",
  "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "no-cache",
  pragma: "no-cache",
  priority: "u=1, i",
  "sec-ch-ua":
    '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "macOS",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
} as const;
