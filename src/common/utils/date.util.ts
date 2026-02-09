export function formatDateToYYYYMMDD(date: Date): string {
  if (!(date instanceof Date)) {
    return '';
  }
  return date.toISOString().split('T')[0];
}

export function getThaiDateRange(date = new Date()) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);

  const year = parseInt(parts.find((p) => p.type === 'year')!.value)
  const month = parseInt(parts.find((p) => p.type === 'month')!.value) - 1;
  const day = parseInt(parts.find((p) => p.type === 'day')!.value);

  const start = new Date(Date.UTC(year, month, day, 0 - 7, 0, 0, 0));

  const end = new Date(Date.UTC(year, month, day, 23 - 7, 59, 59, 999));

  return { start, end };
}
