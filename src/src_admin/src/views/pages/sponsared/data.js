let sponsaredGallery = {
    img_url: '',
    title : '',
    description : '',    
    file_type : '',
    file_size : ''
}

export let sponsaredGalleryList = {
    img_url: '',
    img_title : '',
    img_description : '',
    file_type : '',
    file_size : ''
}

export let initialSponsaredValues = { 
    property_id: '',
    property_title: '',
    categories: '',
    sequence_no: '',
    published_date: '',
    is_dedicated : "0",

    // user Info
    sponsared_title : '',
    sponsared_description : '',
    user_id : '',
    user_name : '',
    user_logo_url : '', 
    user_short_description : '', 
    total_site_visits : '', 
    total_bookings : '', 
    direct_site_visits : '', 
    total_revenue : '',
    background_img_url: '', 
    theme_color : '',
    //sponsared Gallery
    sponsared_gallery : sponsaredGallery,
    sponsared_gallery_list: [sponsaredGalleryList], 
}

export const categoriesOption = [
    { id : 1, title: 'SPOTLIGHT', value: 'SPOTLIGHT' },
    { id : 2, title: 'HOME BANNER', value: 'HOME_BANNER' },
    { id : 3, title: 'PROPERTY LIST BANNER', value: 'PROPERTY_LIST_BANNER' },
    { id : 4, title: 'PROPERTY DETAILS BANNER', value: 'PROPERTY_DETAILS_BANNER' },
    { id : 5, title: 'BUILDER SPOTLIGHT', value: 'BUILDER_SPOTLIGHT' }, 
]

export const imageGallery = [
    { name: "Category 1", image: "https://8sqft-images.s3.eu-north-1.amazonaws.com/feb-2025/819/main-image-1740213506480-962379695.png" },
    { name: "Category 2", image: "https://8sqft-images.s3.eu-north-1.amazonaws.com/feb-2025/819/main-image-1740213506480-962379695.png" },
    { name: "Category 3", image: "https://8sqft-images.s3.eu-north-1.amazonaws.com/feb-2025/819/main-image-1740213506480-962379695.png" },
    { name: "Category 4", image: "https://8sqft-images.s3.eu-north-1.amazonaws.com/feb-2025/819/main-image-1740213506480-962379695.png" }
  ];