
export const addDate = (days, date = new Date()) => {
    let result = new Date(date);
    result.setDate(date.getDate() + days)
    return result;
}

// return formatted date eg. "01-01-2023"
export const formattedDate = (isoString = new Date().toISOString()) => {
    const date = new Date(isoString);
    if (isNaN(date)) {
      throw new Error('Invalid date input');
    }
  
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join('-');
}

export const currentDateInfo = (options = {}) => {
  const currentDate = new Date();
  const dateInfo = {};

  if (options.year) {
    dateInfo.year = currentDate.getFullYear();
  }
  if (options.month) {
    dateInfo.month = currentDate.getMonth() + 1;
  }
  if (options.monthInWord) {
    dateInfo.month = currentDate.toLocaleString('en-US', { month: 'long' });
  }
   if (options.shortMonthInWord) {
    dateInfo.month = currentDate.toLocaleString('en-US', { month: 'short' });
  }
  if (options.day) {
    dateInfo.day = currentDate.getDate(); 
  }

  return Object.keys(dateInfo).length ? dateInfo : currentDate;
};

// import { utcToZonedTime } from 'date-fns-tz';
// const utcDate = '2025-01-31T18:30:00.000Z';
// const timeZone = 'UTC';
// const zonedDate = utcToZonedTime(utcDate, timeZone);
// const formattedDate = format(zonedDate, 'dd/MM/yyyy');