import { useMemo } from 'react';

// Date parser for the 7timer API Civil light product

// Date parser for the 7timer API Civil light product

export const parseSevenDaysDate = (dateNumber: number) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const year = Math.floor(dateNumber / 10000);
  const month = Math.floor((dateNumber % 10000) / 100) - 1; // Months are 0-indexed
  const day = dateNumber % 100;

  const date = new Date(year, month, day);
  return formatDate(date);
};

// Keep the old hook for backward compatibility but mark as deprecated
export const useSevenDaysParser = (dateNumber: number) => {
  return parseSevenDaysDate(dateNumber);
};

// Date parser for the 7timer API Civil product (today's weather)

export const newCalculatedDate = (input: string, hours: number) => {
  const hoursToAdd = Number(hours);
  if (!input) return '';

  const year = parseInt(input.slice(0, 4), 10);
  const month = parseInt(input.slice(4, 6), 10);
  const day = parseInt(input.slice(6, 8), 10);
  const originalHour = parseInt(input.slice(8, 10), 10);
  const calculatedHour = (originalHour + hoursToAdd) % 24;

  const calculatedDate = new Date(year, month - 1, day, calculatedHour);

  return `${day}/${month}/${year} at ${calculatedDate.getHours()}:00`;
};

// Date parser for the 7timer API Civil product (5 days forecast)
interface DataSeries {
  timepoint: number;
  // Other properties in the data object
}

const parseDate = (dateStr: string): Date => {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1;
  const day = parseInt(dateStr.slice(6, 8), 10);
  const hour = parseInt(dateStr.slice(8, 10), 10);
  return new Date(year, month, day, hour);
};

const formatDate = (date: Date): string => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekday = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const hour = date.getHours();
  const daySuffix =
    ['st', 'nd', 'rd'][((((dayOfMonth + 90) % 100) - 10) % 10) - 1] || 'th';
  return `${weekday}, ${dayOfMonth}${daySuffix} at ${hour
    .toString()
    .padStart(2, '0')}:00 hours`;
};

export const useDateParser = (init: string, dataseries: DataSeries[]) => {
  const formattedDates = useMemo(() => {
    const initialDate = parseDate(init);
    return dataseries.map((data) => {
      const updatedDate = new Date(initialDate);
      updatedDate.setHours(updatedDate.getHours() + data.timepoint);
      return formatDate(updatedDate);
    });
  }, [init, dataseries]);

  return formattedDates;
};
