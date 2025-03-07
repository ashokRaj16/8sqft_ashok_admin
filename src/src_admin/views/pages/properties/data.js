import { constant } from '../../../utils/constant'

export const formStepOptions = [
  { value: 1, title: 'Step 1 (Initiated)' },
  { value: 2, title: 'Step 2 (Details)' },
  { value: 3, title: 'Step 3 (Ameneties)' },
  { value: 4, title: 'Step 4 (Images)' },
  { value: 5, title: 'Step 5 (Completed)' },
]

export const mailTypes = [
  { id: 1, title: 'Porperty Approved' },
  { id: 2, title: 'Porperty Rejected' },
  { id: 3, title: 'Porperty Pending' },
  { id: 4, title: 'Porperty Notification' },
]

export const availableMonths = [
  { id: 1, title: "January" },
  { id: 2, title: "February" },
  { id: 3, title: "March" },
  { id: 4, title: "April" },
  { id: 5, title: "May" },
  { id: 6, title: "June" },
  { id: 7, title: "July" },
  { id: 8, title: "August" },
  { id: 9, title: "September" },
  { id: 10, title: "October" },
  { id: 11, title: "November" },
  { id: 12, title: "December" }
];

export const availableYears = [
  { id: 1, title: "2010" },
  { id: 2, title: "2011" },
  { id: 3, title: "2012" },
  { id: 4, title: "2013" },
  { id: 5, title: "2014" },
  { id: 6, title: "2015" },
  { id: 7, title: "2016" },
  { id: 8, title: "2017" },
  { id: 9, title: "2018" },
  { id: 10, title: "2019" },
  { id: 11, title: "2020" },
  { id: 12, title: "2021" },
  { id: 13, title: "2022" },
  { id: 14, title: "2023" },
  { id: 15, title: "2024" },
  { id: 16, title: "2025" },
  { id: 17, title: "2026" },
  { id: 18, title: "2027" },
  { id: 19, title: "2028" },
  { id: 20, title: "2029" },
  { id: 21, title: "2030" },
  { id: 22, title: "2031" },
  { id: 23, title: "2032" },
  { id: 24, title: "2033" },
  { id: 25, title: "2034" },
  { id: 26, title: "2035" },
  { id: 27, title: "2036" },
  { id: 28, title: "2037" },
  { id: 29, title: "2038" },
  { id: 30, title: "2039" },
  { id: 31, title: "2040" }
];

export const propertyStatus = [
  { id: 1, title: constant.PROPERTY_STATUS.PENDING },
  { id: 2, title: constant.PROPERTY_STATUS.APPROVED },
  { id: 3, title: constant.PROPERTY_STATUS.REJECTED },
  { id: 4, title: constant.PROPERTY_STATUS.DELISTED },
  { id: 5, title: constant.PROPERTY_STATUS.SOLD_OUT },
  { id: 6, title: constant.PROPERTY_STATUS.RENT_OUT },
]

export const otherAmenties = [
  { id: 1, title: 'Lift' , value : 'Lift', userType : [constant.PROPERTY_USER_TYPE.OWNER, constant.PROPERTY_USER_TYPE.BUILDER], categories : [constant.PROPERTY_TYPE.RESIDENTIAL, constant.PROPERTY_TYPE.COMMERCIAL] },
  { id: 2, title: 'CCTV' , value : 'CCTV' },
  { id: 3, title: 'Air Conditioner' , value : 'Air Conditioner'},
  { id: 4, title: 'GYM', value : 'GYM' },
  { id: 5, title: 'Play Area' , value : 'Play Area' },
  { id: 6, title: 'Fire Safety' , value : 'Fire Safety' },
  { id: 7, title: 'Garden' , value : 'Garden'},
  { id: 8, title: 'Boundary Wall', value : 'Boundary Wall' },
  { id: 9, title: 'Internet Service', value : 'Internet Service' },
  { id: 10, title: 'Club House', value : 'Club House' },
  { id: 11, title: 'Intercom', value : 'Intercom' },
  { id: 12, title: 'Park', value : 'Park' },
  { id: 13, title: 'House Keeping', value : 'House Keeping' },
  { id: 14, title: 'Solar Water', value : 'Solar Water' },
  { id: 15, title: 'Indoor Games', value : 'Internet Service' },
  { id: 16, title: 'Conference', value : 'Conference' },
  { id: 17, title: 'DG Availability', value : 'DG Availability' },
  { id: 18, title: 'Gayser', value : 'Gayser' },
  { id: 19, title: 'Temple' , value : 'Temple' },
  { id: 20, title: 'Street Pole' , value : 'Street Pole' },
  { id: 21, title: 'Cement Road' , value : 'Cement Road'},
  { id: 22, title: 'Drainage', value : 'Drainage' },
  { id: 23, title: 'Swimming Pool' , value : 'Swimming Pool' },
  { id: 24, title: 'Day Care' , value : 'Day Care' },
  { id: 25, title: 'Shopping Center' , value : 'Shopping Center'},
  { id: 26, title: 'Power Backup', value : 'Power Backup' },

  { id: 27, title: 'Common TV' , value : 'Common TV' },
  { id: 28, title: 'Mess' , value : 'Mess'},
  { id: 29, title: 'Cooler', value : 'Cooler' },
  { id: 30, title: 'Water Purifier' , value : 'Water Purifier' },
  { id: 31, title: 'Mattress' , value : 'Mattress' },
  { id: 32, title: 'Washing Machine' , value : 'Washing Machine'},
  { id: 33, title: 'Servant Room', value : 'Servant Room' },
  { id: 34, title: 'Amphitheatre', value : 'Amphitheatre' },
  { id: 35, title: 'Rain Water Harvesting', value : 'Rain Water Harvesting' },
]

export const FurnishingStatusAmenties = [
  { id: 1, title: 'Furnished' , value : 'Furnished' },
  { id: 2, title: 'UnFurnished' , value : 'UnFurnished' },
  { id: 3, title: 'Semi-Furnished' , value : 'Semi-Furnished'},
]

export const PreferredTenent = [
  { id: 1, title: 'Anyone' , value : 'Anyone' },
  { id: 2, title: 'Bachelor Female' , value : 'Bachelor Female' },
  { id: 3, title: 'Bachelor Male' , value : 'Bachelor Male' },
  { id: 4, title: 'Company' , value : 'Company'},
  { id: 5, title: 'Family' , value : 'Family' }
]

export const ParkingAmenties = [
  { id: 1, title: '2 Wheeler' , value : '2 Wheeler' },
  { id: 2, title: '4 Wheeler' , value : '4 Wheeler' },
  { id: 3, title: '2+4 Wheeler' , value : '2+4 Wheeler' },
  { id: 4, title: 'No Parking' , value : 'No Parking'},
  { id: 5, title: 'Public & Reserved' , value : 'Public & Reserved' },
  { id: 6, title: 'Public' , value : 'Public' },
  { id: 7, title: 'Reserved' , value : 'Reserved'},
]

export const WashroomAmenties = [
  { id: 1, title: 'Shared' , value : 'Shared' },
  { id: 2, title: 'Private' , value : 'Private' },
  { id: 3, title: 'No Washroom' , value : 'No Washroom' }
]

export const pgRuleAmenties = [
  { id: 1, title: 'Boys' , value : 'Boys' },
  { id: 2, title: 'Girls' , value : 'Girls' },
  { id: 3, title: 'Family' , value : 'Family' },
  { id: 4, title: 'Guardian' , value : 'Guardian' }
]

export const BasicYNAmenties = [
  { id: 1, title: 'Yes' , value : '1' },
  { id: 2, title: 'No' , value : '0' }
]

export const configurationUnit = [
  { id: 1, title: 'SQ FT' , value : 'SQ FT' },
  { id: 2, title: 'SQ M' , value : 'SQ M' }
]

export const projectAreaUnit = [
  { id: 1, title: 'ACRE' , value : 'ACRE' },
  { id: 2, title: 'SQ FT' , value : 'SQ FT' }
]

export const isMaintenanceOptions = [
  { id: 1, title: 'Included' , value : 'Included' },
  { id: 2, title: 'Excluded' , value : 'Excluded' }
]

export const doorFacingOptions = [
  { id: 1, title: 'East' , value : 'East' },
  { id: 2, title: 'West' , value : 'West' },
  { id: 3, title: 'North' , value : 'North' },
  { id: 4, title: 'South' , value : 'West' }
]

export const NegotiableType = [
  { id: 1, title: 'Negotiable' , value : '1' },
  { id: 2, title: 'Non-Negotiable' , value : '0' }
]

export const ImageOptions = [
  { id: 1, title: 'Main Image', category : 'Images', propertyType : [] },
  { id: 2, title: 'Entrance Photo', category : 'Images', propertyType : [] },
  { id: 3, title: 'Plot Photo', category : 'Images', propertyType : [] },
  { id: 4, title: 'Road Photo', category : 'Images', propertyType : [] },
  { id: 5, title: 'Garden Photo', category : 'Images', propertyType : [] },
  { id: 6, title: 'Temple Photo', category : 'Images', propertyType : [] },
  { id: 7, title: 'Others', category : 'Images', propertyType : [] },
  { id: 8, title: 'Video', category : 'Video', propertyType : [] },
  { id: 9, title: 'Layout Plan', category : 'Document', propertyType : [] },
  { id: 10, title: 'Property Agreement', category : 'Document', propertyType : [] },
  { id: 11, title: 'DA & PA', category : 'Document', propertyType : [] },
  { id: 12, title: '7/12 or 8A', category : 'Document', propertyType : [] },
  { id: 13, title: 'RERA', category : 'RERA', propertyType : [] },
  { id: 14, title: 'Broucher', category : 'Broucher', propertyType : [] },
  { id: 15, title: 'Youtube', category : 'Youtube', propertyType : [] },
  { id: 16, title: 'Youtube Short', category : 'Youtube Short', propertyType : [] }
]

export const NearbyOptions = [
  { id: 1, title: 'Railway Station' , value : '1' },
  { id: 2, title: 'Airways' , value : '2' }
]

export const unitNameConfigOption = [
  { id: 1, title: 'Studio', value: 'Studio', varietyType: [ constant.PROJECT_VARIETY.APARTMENT ]},
  { id: 1, title: '1 RK', value: '1 RK', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW,  ]},
  { id: 2, title: '1 BHK', value: '1 BHK', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.PENTHOUSE, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW, ]},
  { id: 3, title: '2 BHK', value: '2 BHK', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.PENTHOUSE, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW, constant.PROJECT_VARIETY.OTHER ]},
  { id: 4, title: '3 BHK', value: '3 BHK', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.PENTHOUSE, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW, constant.PROJECT_VARIETY.OTHER  ]},
  { id: 5, title: '4 BHK', value: '4 BHK', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.PENTHOUSE, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW, constant.PROJECT_VARIETY.OTHER ]},
  { id: 6, title: '5+ BHK', value: '5+ BHK', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.PENTHOUSE, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW, constant.PROJECT_VARIETY.OTHER ]},
  { id: 7, title: 'Other', value: 'Other', varietyType: [ constant.PROJECT_VARIETY.APARTMENT, constant.PROJECT_VARIETY.PENTHOUSE, constant.PROJECT_VARIETY.ROW_HOUSE, constant.PROJECT_VARIETY.VILLA, constant.PROJECT_VARIETY.BUNGALOW, constant.PROJECT_VARIETY.OTHER ]},
]

export let initialPropertyDetailsValues = {
  user : '',
  images: '',  
  user_type: '',
  property_title: '',
  company_name: '',
  description: '',
  short_description: '',
  latitude: '',
  longitude: '',
  land_area: '',
  land_area_unit: '',
  is_maintenance: '',
  property_variety_type: '',
  property_availibility_type: '',
  builtup_area: '',
  builtup_area_unit: '',
  rent_amount: '',
  deposite_amount: '',
  property_type: '',
  bed_rooms: '',
  washrooms: '',
  floor_number: '',
  total_floors: '',
  property_floors: '',
  balcony: '',
  is_wings: '',
  unit_number: '',
  total_wing: '',
  wing_name: '',
  property_variety: '',
  property_rent_buy: '',
  rent_is_nogotiable: '',
  deposite_is_negotiable: '',
  availability_date: '',
  availability_duration: '',
  property_age: '',
  furnishing_status: '',
  parking: '',
  water_supply: '',
  washroom_type: '',
  granted_security: '',
  other_amenities: '',
  door_facing: '',
  preferred_tenent: '',
  pet_allowed: '',
  non_veg_allowed: '',
  expected_amount: '',
  drink_allowed: '',
  smoke_allowed: '',
  pg_rules: '',
  exected_amount_sqft: '',
  per_sqft_amount: '',
  monthly_maintenance: '',
  ownership_type: '',
  dimension_length: '',
  dimension_width: '',
  width_facing_road: '',
  sewage_connection: '',
  electricity_connection: '',
  rera_number: '',
  is_rera_number: '',
  property_current_status: '',
  possession_status: '',
  possession_date: '',
  possession_month : '',
  possession_year : '',
  total_towers: '',
  total_units: '',
  project_area: '',
  project_area_unit: '',
  unique_view_count: '',
  ip_address: '',
  user_agent: '',
  host_name: '',
  status: '',
  status_text: '',
  is_deleted: '',
  added_by: '',
  updated_by: '',
  publish_date: '',
  created_at: '',
  updated_at: '',

}

export let initialPropertyFandQValues = {
  faq_questions : '',
  faq_answer : ''
}

export let initialPropertyConfigurationValues = {
  unit_name : '',
  carpet_area : '',
  carpet_price:'',
  length: '',
  width: '',
  width_unit: '',
  length_unit: '',
  image : '',
}

export let initialPropertyImagesValues = {
  property_id : '',
  img_title : '',
  image_category : '',
  images : '',
  images_type: ''
}

export let initialPropertyNearbyValues = {
  nearby_id : '',
  location_value : '',
  location_title : '',
  distance : '',
  time : '',
  latitude : '',
  longitude : ''
}