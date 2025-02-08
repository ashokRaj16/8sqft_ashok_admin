import * as Yup from 'yup';

export const blogValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    short_description: Yup.string().required("Short description is required").max(200, "Meta description must not exceed 200 characters"),
    // banner_image: Yup.mixed().required("Banner image is required"),
    category: Yup.string().required("Category is required"),
    tags: Yup.string().required("Tags are required"),
    author_name: Yup.string().required("Author name is required"),
    publish_date: Yup.date().required("Publish date is required"),
    
    meta_title: Yup.string().required("Meta title is required"),
    meta_description: Yup.string().max(160, "Meta description must not exceed 160 characters"),
    meta_keyword: Yup.string().required("Meta keywords are required")
  });