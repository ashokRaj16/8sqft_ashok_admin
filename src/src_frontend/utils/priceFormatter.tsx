export const formatNumber = (num: number) => {
    if (num >= 10000000) return Math.floor(num / 1000000) / 10 + " cr"; // Crores
    if (num >= 100000) return Math.floor(num / 10000) / 10 + " lacs"; // Lakhs
    if (num >= 1000) return Math.floor(num / 100) / 10 + "k"; // Thousands
    return num?.toString(); // Less than 1000, keep original
      };