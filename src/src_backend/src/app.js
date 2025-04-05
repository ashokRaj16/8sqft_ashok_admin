import express from "express";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import frontRoutes from './routes/frontRoutes.js';

import locationRoutes from './routes/locationRoutes.js';
import { messageCallback } from "./controllers/authController.js";

import { accessKeyMiddleware } from "./Middleware/accessKeyMiddleware.js";
import { badRequestResponse } from "./utils/response.js";

const app = express();

app.post('/gupshup-webhook', messageCallback);
app.use(accessKeyMiddleware);

app.use('/admin', adminRoutes);
app.use("/front", frontRoutes);
app.use("/auth", authRoutes);

app.use("/location", locationRoutes);

app.get("*", (req, res) => {
  return badRequestResponse (res, false, '404! Not found error.');
});

export default app;