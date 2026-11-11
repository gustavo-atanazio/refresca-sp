const LOCALE = 'pt-BR';

function formatDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  return `${formatDate(date)} às ${formatTime(date)}`;
}

function formatTemperature(temperature: number): string {
  return `${temperature.toFixed(1).replace('.', ',')}°`;
}

function formatTimeAgo(isoDate: string, now: Date): string {
  const seconds = Math.max(0, Math.round((now.getTime() - new Date(isoDate).getTime()) / 1000));

  if (seconds < 60) return `há ${seconds} s`;

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `há ${minutes} min`;

  return `há ${Math.floor(minutes / 60)} h`;
}

export { formatDate, formatTime, formatDateTime, formatTemperature, formatTimeAgo };