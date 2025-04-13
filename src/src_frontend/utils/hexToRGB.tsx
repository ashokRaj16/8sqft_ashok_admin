export const hexToRgba = (hex: string, opacity: number) => {
    // Remove "#" if present
    hex = hex?.replace(/^#/, "");
  
    // Convert shorthand hex to full hex
    if (hex?.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
  
    // Convert hex to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  