import * as Yup from 'yup';

const yotubeRegEx = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}(&\S*)?$/;

export const blogValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    short_description: Yup.string().required("Short description is required").max(300, "Meta description must not exceed 300 characters"),
    banner_image: Yup.mixed(),
    banner_video: Yup.mixed(),
    youtube_url: Yup.string().matches(yotubeRegEx, 'Enter valid youtube URL'),
    cat_id: Yup.string().required("Category is required"),
    tags: Yup.string().required("Tags are required"),
    author_name: Yup.string().required("Author name is required"),
    publish_date: Yup.date().required("Publish date is required"),
    
    // meta_title: Yup.string().required("Meta title is required"),
    // meta_description: Yup.string().max(160, "Meta description must not exceed 160 characters"),
    // meta_keyword: Yup.string().required("Meta keywords are required")
  }).test('oneOfBanner', 'Either Banner Image or Banner Video is required', function (values) {
    const { banner_image, banner_video } = values;
    if (!banner_image && !banner_video) {
      return this.createError({
        path: 'banner_image',
        message: 'Either Banner Image or Banner Video is required',
      });
    }
    return true;
  });