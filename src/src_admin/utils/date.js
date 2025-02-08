

// export const addDate = (days, date = new Date()) => {
//     let result = new Date(date);
//     result.setDate(date.getDate() + days)
//     return result;
// }

// return formatted date eg. "01-01-2023"
export function formattedDate(isoString = new Date().toISOString()) {
    const date = new Date(isoString); // Parse the ISO string to a Date object
    console.log(isoString, date);
    if (isNaN(date)) {
      throw new Error('Invalid date input');
    }
  
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join('-');
  }


//   import { utcToZonedTime } from 'date-fns-tz';

// const utcDate = '2025-01-31T18:30:00.000Z'; // Your date
// const timeZone = 'UTC'; // Keep it in UTC
// const zonedDate = utcToZonedTime(utcDate, timeZone); // Convert to UTC timezone
// const formattedDate = format(zonedDate, 'dd/MM/yyyy'); // Format the date