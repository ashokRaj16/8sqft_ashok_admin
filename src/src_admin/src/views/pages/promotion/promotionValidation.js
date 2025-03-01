import * as Yup from 'yup';
import { categoriesOption } from './data'

export const validationPromotionSchema = Yup.object({
    property_id : Yup.string().notOneOf(['-1']).required('Property id is required'),    
    categories: Yup.string().notOneOf(['-1']).required('Categories is required'),
    banner_id : Yup.string().when('categories',
        {
            is: (value) => [ categoriesOption[1].value, categoriesOption[2].value, categoriesOption[3].value].includes(value),
            then: (schema) => schema.notOneOf(['-1'], 'Banner is required.').required('Banner is required'),
            otherwise : (schema) => schema.nullable()
        }
    ),
    sequence_no: Yup.string(),
    published_date : Yup.string().required('Publish date is required'),
});