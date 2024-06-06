export function convertFromUnix(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleString();
}
