import pool from "../../config/db.js";
import { successResponse, badRequestResponse, successWithDataResponse } from "../../utils/response.js";
import { propertyContactValidators } from "../validators/propertyValidators.js";

export const contactDeveloper = async (req, res) => {
  try {
    const validationErrors = propertyContactValidators(req.body);
    if (validationErrors.length > 0) {
      return badRequestResponse(res, false, "Validation Error.", validationErrors );
    }

    const { name, phone, email, selected_plot_size, interested_in_loans, contact_for_similar_options } = req.body;

    const query = `INSERT INTO tbl_contact_developer 
      (name, phone, email, selected_plot_size, interested_in_loans, contact_for_similar_options) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    const params = [name || null, phone || null, email || null, selected_plot_size || null, interested_in_loans || null, contact_for_similar_options || null]
    const [result] = await pool.execute(query, params);

    const data = { result, ...params}
    return successWithDataResponse(res, true, 'Your request has been submitted successfully.', data);

  } catch (error) {
    console.error(error);
    return badRequestResponse(res, false, "Server error, please try again later.", error );
  }
};
