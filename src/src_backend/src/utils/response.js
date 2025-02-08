
// success responses
const successResponse = (res, status, message, data = null) => {
    return res.status(200).json({ status, message, data});
}

const successWithDataResponse = (res, status, message, data) => {
    return res.status(201).json({ status, message, data});
}

// error response
const badRequestResponse = (res, status, message, error = null) => {
    return res.status(400).json({ status, message, error});
}

const unauthorizedResponse = (res, status, message, error = null) => {
    return res.status(401).json({ status, message, error });
};

const notfoundResponse = (res, status, message, error = null) => {
    return res.status(404).json({ status, message, error});
}

const internalServerResponse = (res, status, message, error = null) => {
    return res.status(500).json({ status, message, error});
}


// ### neeed 401 & 403 reponse status.
export { successResponse, successWithDataResponse, badRequestResponse, notfoundResponse, internalServerResponse, unauthorizedResponse };