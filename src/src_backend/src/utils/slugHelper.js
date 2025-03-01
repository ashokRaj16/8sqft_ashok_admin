export const generateSlug = (property_title, locality, city_name, id) => {
  const parts = [property_title, locality, city_name, id].filter(part => part);
  let slug = parts.join('-');
  slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug;
};
