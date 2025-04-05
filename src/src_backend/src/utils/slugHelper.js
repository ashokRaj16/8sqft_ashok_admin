export const generateSlug = (property_title, locality, city_name, id) => {
    const parts = [property_title, locality, city_name, id]
      .filter(part => part) // Remove empty values
      .map(part => part.toString().replace(/,/g, '-')); // Replace commas with hyphens
  
    let slug = parts.join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-') // Replace non-alphanumeric characters with hyphen
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start & end
  
    return slug;
};

export const generateSponsaredSlug = (property_title, categories, id) => {
  const parts = [property_title, categories, id]
    .filter(part => part)
    .map(part => part.toString().replace(/,/g, '-'));

  let slug = parts.join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-') 
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug;
};
  
