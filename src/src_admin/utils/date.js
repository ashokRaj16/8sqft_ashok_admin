

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