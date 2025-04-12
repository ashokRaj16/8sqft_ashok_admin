import * as Yup from 'yup'
import { categoriesOption } from './data'

export const validationSponsaredSchema = () =>{

 return Yup.object({
  // property_id : Yup.string().notOneOf(['-1']).required('Property id is required'),
  property_id: Yup.string().when('categories', {
    is: (value) =>
      [categoriesOption[1].value, categoriesOption[2].value, categoriesOption[3].value].includes(
        value,
      ),
    then: (schema) => schema.required('Property id is required.'),
    otherwise: (schema) => schema.nullable(),
  }),

  categories: Yup.string().notOneOf(['-1']).required('Categories is required'),
  sponsared_gallery: Yup.object().when('categories', {
    is: (value) =>
      [categoriesOption[1].value, categoriesOption[2].value, categoriesOption[3].value].includes(
        value,
      ),
    then: (schema) =>
      schema.shape({
        img_url: Yup.string().required('Image is required.'),
        title: Yup.string().required('Title is required'),
        description: Yup.string(),
        file_type: Yup.string().nullable(),
        file_size: Yup.string().nullable(),
      }),
    otherwise: (schema) => schema.optional(),
  }),

//   sponsored_gallery_list: Yup.array().when('categories', {
//     is: (value) =>
//         [categoriesOption[4].value].includes(
//           value,
//         ), 
//     then: Yup.array()
//       .of(
//         Yup.object().shape({
//           img_title: Yup.string().required('Title is required'),
//           img_description: Yup.string().required('Description is required'),
//           img_url: Yup.string().required('Image is required'),
//         }),
//       ),
//     //   .min(1, 'At least one gallery item is required.'),
  
//     otherwise: Yup.array()
//       .of(
//         Yup.object().shape({
//           img_title: Yup.string(),
//           img_description: Yup.string(),
//           img_url: Yup.string(),
//         }),
//       ),
//   }),

sponsared_gallery_list: Yup.array().when('categories', (categories, schema) => {
    console.log(categories[0], categoriesOption, "validation")
    if (categories[0] === categoriesOption[4]?.value) {
      return schema
        .of(
          Yup.object().shape({
            img_title: Yup.string().required('Title is required'),
            img_description: Yup.string().required('Description is required'),
            img_url: Yup.string().required('Image is required'),
          })
        )
        .min(1, 'At least one gallery item is required.');
    } 
    else {
      return schema
        .of(
          Yup.object().shape({
            img_title: Yup.string().nullable(),
            img_description: Yup.string().nullable(),
            img_url: Yup.string().nullable(),
          })
        );
    }
  }),

  
// sponsared_gallery_list: Yup.array().of(
//     Yup.object().shape({
//       img_title: Yup.string().required('Title is required'),
//       img_description: Yup.string().required('Description is required'),
//       img_url: Yup.string().required('Image URL is required'),
//     })
//   ).min(1, 'At least one item is required'),

  user_id: Yup.string().when('categories', {
    is: (value) => [categoriesOption[4].value].includes(value),
    then: (schema) => schema.required('User is required.'),
    otherwise: (schema) => schema.nullable(),
  }),
  sponsared_title: Yup.string().when('categories', {
    is: (value) => [categoriesOption[4].value].includes(value),
    then: (schema) => schema.required('Title is required.'),
    otherwise: (schema) => schema.nullable(),
  }),
  sponsared_description: Yup.string().when('categories', {
    is: (value) => [categoriesOption[4].value].includes(value),
    then: (schema) => schema.required('Description is required.'),
    otherwise: (schema) => schema.nullable(),
  }),

  total_site_visits: Yup.number()
    .typeError('Total site visits must be a number.')
    .when('categories', {
      is: (value) => [categoriesOption[4].value].includes(value),
      then: (schema) => schema.positive('Number must be positive.'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

  total_bookings: Yup.number()
    .typeError('Total bookings must be a number.')
    .when('categories', {
      is: (value) => [categoriesOption[4].value].includes(value),
      then: (schema) => schema.positive('Number must be positive.'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

  direct_site_visits: Yup.number()
    .typeError('Total direct visits must be a number.')
    .when('categories', {
      is: (value) => [categoriesOption[4].value].includes(value),
      then: (schema) => schema.positive('Number must be positive.'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

  total_revenue: Yup.number()
    .typeError('Total revenue must be a number.')
    .when('categories', {
      is: (value) => [categoriesOption[4].value].includes(value),
      then: (schema) => schema.positive('Number must be positive.'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

  sequence_no: Yup.string(),
  published_date: Yup.string().required('Publish date is required'),
})

// export const validationGallerySchema = Yup.object({
//     img_title: Yup.string().required('Title is required'),
//     img_description: Yup.string().required('Description is required'),
//     img_url: Yup.string().required('Image is required')
// })
}