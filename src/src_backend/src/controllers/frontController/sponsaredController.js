
import { getPropertyConfigurationById, getPropertyFaqById, getPropertyImagesById, getPropertyNearbyLocationsById } from "../../models/propertyModels.js";
import { getSpotlightData, getPropertyCountByIds,
  getSpotlightHeroBannerData,
  getSpotlightStoryData,
  getPropertyDetailsById,
  getPropertyContructionPhaseById,
  getSponsaredImagesById,
  getBuilderDetailsById, } from "../../models/sponsaredModel.js";

import {
  badRequestResponse,
  successResponse,
  successWithDataResponse,
} from "../../utils/response.js";

/**
 * For: Home Spotlight
 * * @param {*} query : limit
 * @param {*} res 
 * @returns 
 */
export const getSponsaredList = async (req, res) => {
  try {
    const { limit } = req.query;

    let spotlights = await getSpotlightData(limit || 10 );
    if (!spotlights || spotlights.length === 0) {
      return badRequestResponse(res, false, "No spolight found for the given criteria.");
    }

    let ids = spotlights.map((i)=> `${i.id}`)
    let resultCountProperty = await getPropertyCountByIds(ids);

    let newSpotlight = spotlights.map((item) => {
      let findProperty = resultCountProperty.find((i) => i.property_id === item.id);
      if (findProperty) {
        return {
          ...item,
          unique_view_count:
            (item.unique_view_count || 0) +
            (findProperty?.views || 0)
        };
      }
      return item;
    });
        
    return successWithDataResponse(res, true, 'Spotlight properties retrieved successfully.', newSpotlight);
  } catch (error) {
    console.error('Error fetching spotlight:', error);
    return badRequestResponse(res, false, "Error fetching spotlights.", error);
  }
};

/**
 * For: Home Banner | List Banner | Details Banner
 * * @param {*} query : 
 * @param {*} res 
 * @returns 
 */
export const getSponsaredHeroBannerList = async (req, res) => {
  try {
    const {categories, limit } = req.query;

    let spotlights = await getSpotlightHeroBannerData(limit, categories);
    if (!spotlights || spotlights.length === 0) {
      return successResponse(res, true, "No data found.");
    }

    spotlights = spotlights.map((item) => {
      let updatedSpotlight = {
        ...item,
        title_slug : item.is_dedicated === '1' ? `/BuilderPropertyShowcase/${item.spotlight_slug}` : `/Builder/${item.title_slug}`
      }
      delete spotlights.spotlight_slug
      return updatedSpotlight;
    })

    return successResponse(res, true, 'List banner data.', spotlights);
  } catch (error) {
    console.error('Error fetching data.', error);
    return badRequestResponse(res, false, "Error fetching data.", error);
  }
};

/**
 * For: Spotlight Builder
 * * @param {*} query : 
 * @param {*} res 
 * @returns 
 */
export const getSponsaredBuilderStoryList = async (req, res) => {
  try {
    const { limit } = req.query;

    let storyList = await getSpotlightStoryData(limit || 10);

    if (!storyList || storyList.length === 0) {
      return successResponse(res, true, "No data found.");
    }

    return successResponse(res, true, 'List banner data.', storyList);
  } catch (error) {
    console.error('Error fetching data.', error);
    return badRequestResponse(res, false, "Error fetching data.", error);
  }
};

/**
 * For: Dedicated builder page.
 * @param {*} req {id}
 * @param {*} res 
 * @returns 
 */
export const getSponsaredBuilderStoryById = async (req, res) => {
  try {
    const id = req.params.id;
    let spotlightsbBuilders = await getBuilderDetailsById(id);
        
    if (!spotlightsbBuilders) {
      return badRequestResponse(res, false, "unable to find data or try again after sometimes.");
    }
  
    spotlightsbBuilders.colors = {
      themeColorDark: spotlightsbBuilders.theme_color_dark,
      themeColorLight: spotlightsbBuilders.theme_color_light,
      themeColorGradient: spotlightsbBuilders.theme_color_gradient
    };
    ['theme_color_dark','theme_color_light','theme_color_gradient'].map((key) => delete spotlightsbBuilders[key]);

    const galleryImages = await getSponsaredImagesById(spotlightsbBuilders.tps_id);

    const data = { builder :
      spotlightsbBuilders
    };
    
    data.images = galleryImages || [];

    return successResponse(res, true, 'Spotlight properties retrieved successfully.', data);
  } catch (error) {
    console.error('Error fetching spotlight:', error);
    return badRequestResponse(res, false, "Error fetching spotlights.", error);
  }
};

/**
 * For: Dedicated Property page.
 * @param {*} req {id}
 * @param {*} res 
 * @returns 
 */
export const getSponsaredPropertyById = async (req, res) => {
  try {
    let id = req.params.id;
    if(!id) {
      return badRequestResponse(res, false, "Property id required with request.");
    }
    let propertyResult = await getPropertyDetailsById(id);

    if (!propertyResult) {
      return badRequestResponse(res, false, "unable to find property or try again after sometimes.");
    }
    propertyResult.colors = {
      themeColorDark: propertyResult.theme_color_dark,
      themeColorLight: propertyResult.theme_color_light,
      themeColorGradient: propertyResult.theme_color_gradient
    };

    ['theme_color_dark', 'theme_color_light', 'theme_color_gradient', 'is_deleted', 'added_by', 'updated_by', 'status', 'status_text', 'form_step_id', 'form_status'].forEach(key => delete propertyResult[key]);

    const data = { property: propertyResult };

    const [propertyImages, resultImages, configurationDetails, propertyFaq, nearbyLocations, constructionPhases] = await Promise.all([
      getPropertyImagesById(id),  
      getSponsaredImagesById(propertyResult.tps_id),
      getPropertyConfigurationById(id),
      getPropertyFaqById(id),
      getPropertyNearbyLocationsById(id),
      getPropertyContructionPhaseById(id)
    ]);

    data.images = propertyImages || [];
    data.sponsaredImages = resultImages || [];
    data.configuration = configurationDetails || [];
    data.faq = propertyFaq || [];
    data.nearbyLocations = nearbyLocations || [];
    data.constructionPhases = constructionPhases || [];

    return successResponse(res, true, 'Spotlight properties details.', data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return badRequestResponse(res, false, "Error fetching data.", error);
  }
};

