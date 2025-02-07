import { successResponse, badRequestResponse, successWithDataResponse } from '../../utils/response.js';
import { getAllStates, getAllCitiesByState, getDetailsByPostalCode } from '../../models/locationModels.js';

export const getStates = async (req, res) => {
    try {
      
        let data = {};
        const states = await getAllStates();
        if(states){
            data = states;
            return successWithDataResponse(res, true, "State list", data);
        }
      } 
      catch (error) 
      {
        console.error(error);
        return badRequestResponse(res, false, 'Error fetching states!', error);
      }
};

export const getCitiesByState = async (req, res) => {
    
    try {
      let data = {};
      // const { state_id } = req.query;
      // if(!state_id)
      // {
      //   return badRequestResponse(res,false, 'Validation Message.', { field: 'state_id', message: 'State id is required.'});
      // }
      const cities = await getAllCitiesByState();
      if(cities){
          data = cities;
          return successWithDataResponse(res, true, "State list", data);
      }
    } catch (error) {
      console.error("Database Error:", error);
      return badRequestResponse(res,false, 'Error fetching cities!', error);
    }
};


export const getLocationsByPincodes = async (req, res) => {
    try {
        let data ={}
        const { postalcode } = req.body;
        if(!postalcode)
        {
            return badRequestResponse(res,false, 'Validation Message.', { field: 'postalcode', message: 'Postal code is required.'});
        }
        const postalAreaData = await getDetailsByPostalCode(postalcode);
        if(postalAreaData){
            data = postalAreaData;
            return successWithDataResponse(res, true, "Postal list", data);
        }
      } catch (error) {
        console.error("Database Error:", error);
        return badRequestResponse(res, false, 'Error Fetching postal code data!', error);
      }
};
