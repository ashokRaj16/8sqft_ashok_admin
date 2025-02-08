import { v4 as uuidv4 } from 'uuid';

// Middleware to handle session ID
export const assignSessionId = (req, res, next) => {
  let sessionId = req.headers['sessionId'];
  if (!sessionId) {
    sessionId = uuidv4(); // Generate a unique session ID
    res.setHeader('sessionId', sessionId); // Return the session ID in the response headers
  }
  req.sessionId = sessionId;
  next();
};