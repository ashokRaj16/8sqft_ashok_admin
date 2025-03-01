import pool from "../../config/db.js";
import { sanitizedField, sanitizedNumber } from "../../utils/commonHelper.js";
import { successResponse, badRequestResponse, successWithDataResponse } from "../../utils/response.js";
import { propertyContactValidators } from "../validators/propertyValidators.js";

export const contactDeveloper = async (req, res) => {
  try {
    const validationErrors = propertyContactValidators(req.body);
    if (validationErrors.length > 0) {
      return badRequestResponse(res, false, "Validation Error.", validationErrors );
    }

    const { name, phone, email, property_id, selected_plot_size, interested_in_loans, contact_for_similar_options } = req.body;
    const requestData = {
      name: name && sanitizedField( name, true, "CAPITALIZE" ) || null, 
      phone: phone && sanitizedNumber( phone ) || null, 
      email: email && sanitizedField( email, true, "LOWERCASE" ) || null, 
      property_id: property_id || null, 
      selected_plot_size: selected_plot_size && sanitizedField( selected_plot_size, true) || null, 
      interested_in_loans: interested_in_loans || null, 
      contact_for_similar_options: contact_for_similar_options || null
    }

    const query = `INSERT INTO tbl_contact_developer 
      (name, phone, email, property_id, selected_plot_size, interested_in_loans, contact_for_similar_options) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [ requestData?.name , requestData.phone , requestData.email , requestData.property_id , requestData.selected_plot_size , requestData.interested_in_loans, requestData?.contact_for_similar_options ]
    const [result] = await pool.execute(query, params);

    const data = { insertId: result.insertId, ...requestData}
    return successWithDataResponse(res, true, 'Your request has been submitted successfully.', data);

  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Server error, please try again later.", error );
  }
};
