export function formatDateToYYYYMMDD(date: Date): string {
  if (!(date instanceof Date)) {
    return '';
  }
  return date.toISOString().split('T')[0];
}
