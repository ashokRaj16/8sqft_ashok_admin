import * as Yup from 'yup';

export const validationGallerySchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    // cat_icon: Yup.mixed().required("Category icon is required"),
});