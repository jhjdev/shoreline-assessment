import { useEffect, useState } from "react";

// This ended up being a bit messy.
// I was trying a few different ways
// to parse and render tine and date.
// The useDateParser I think turned
// out to be the most promising one.

export const useFormattedDate = (dateNumber: number) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const getFormattedDate = (dateNumber: number) => {
    const year = Math.floor(dateNumber / 10000);
    const month = Math.floor((dateNumber % 10000) / 100) - 1; // Months are 0-indexed
    const day = dateNumber % 100;
    const date = new Date(year, month, day);
    return formatDate(date);
  };

  const formattedDate = getFormattedDate(dateNumber);

  return formattedDate;
};

export const newCalculatedDate = (input: string, hours: number) => {
  const hoursToAdd = Number(hours);
  if (!input) return "";

  const year = parseInt(input.slice(0, 4), 10);
  const month = parseInt(input.slice(4, 6), 10);
  const day = parseInt(input.slice(6, 8), 10);
  const originalHour = parseInt(input.slice(8, 10), 10);
  const calculatedHour = (originalHour + hoursToAdd) % 24;

  const calculatedDate = new Date(year, month - 1, day, calculatedHour);

  return `${day}/${month}/${year} at ${calculatedDate.getHours()}:00`;
};

interface DataSeries {
  timepoint: number;
  // Other properties in the data object
}

export const useDateParser = (init: string, dataseries: DataSeries[]) => {
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  useEffect(() => {
    const parseDate = (dateStr: string) => {
      const year = parseInt(dateStr.slice(0, 4), 10);
      const month = parseInt(dateStr.slice(4, 6), 10) - 1; // Months are zero-indexed
      const day = parseInt(dateStr.slice(6, 8), 10);
      const hour = parseInt(dateStr.slice(8, 10), 10);

      return new Date(year, month, day, hour);
    };

    const formatDate = (date: Date) => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekday = daysOfWeek[date.getDay()];
      const dayOfMonth = date.getDate();
      const hour = date.getHours();

      let daySuffix;
      if (dayOfMonth === 1) {
        daySuffix = "st";
      } else if (dayOfMonth === 2) {
        daySuffix = "nd";
      } else if (dayOfMonth === 3) {
        daySuffix = "rd";
      } else {
        daySuffix = "th";
      }

      return `${weekday}, ${dayOfMonth}${daySuffix} at ${hour}:00 hours`;
    };

    const formattedDatesArray: string[] = [];

    dataseries.forEach((data) => {
      const { timepoint } = data;
      const initialDate = parseDate(init);
      const updatedDate = new Date(initialDate);
      updatedDate.setHours(updatedDate.getHours() + timepoint);

      if (timepoint === 24) {
        updatedDate.setDate(updatedDate.getDate() + 1);
      }

      const formattedDate = formatDate(updatedDate);
      formattedDatesArray.push(formattedDate);
    });

    setFormattedDates(formattedDatesArray);
  }, [init, dataseries]);

  return formattedDates;
};
