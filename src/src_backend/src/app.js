import express from "express";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import frontRoutes from './routes/frontRoutes.js';

import locationRoutes from './routes/locationRoutes.js';
// import agreementRoutes from "./routes/agreementRoutes.js"

import { accessKeyMiddleware } from "./Middleware/accessKeyMiddleware.js";

const app = express();

app.use((req, res, next) => { console.log(`[${new Date()}] ${req.method} ${req.url}`); next(); });



app.use(accessKeyMiddleware);

app.use('/admin', adminRoutes);
app.use("/front", frontRoutes);
app.use("/auth", authRoutes);

app.use("/location", locationRoutes);

app.get("*", (req, res) => {
  res.status(404).json({ status: false, message: '404! Not found error.'});
});

export default app;