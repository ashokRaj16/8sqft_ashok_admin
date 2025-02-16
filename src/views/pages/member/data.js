

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
  { id: 1, title: 'Acre' , value : 'Acre' },
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