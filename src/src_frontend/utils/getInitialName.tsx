export const getInitials = (fname: any, lname: any) => {
    const firstInitial = fname ? fname.charAt(0).toUpperCase() : "";
    const lastInitial = lname ? lname.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };