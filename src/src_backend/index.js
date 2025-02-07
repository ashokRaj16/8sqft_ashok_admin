import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { xss } from "express-xss-sanitizer";
import morgan from "morgan";
import helmet from "helmet";
import fs from 'fs';
// Routes
import viewRoutes from "./src/routes/viewRoutes.js";

import { fileURLToPath } from 'url';
import app from "./src/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
dotenv.config();

const port = process.env.PORT || 5000;

server.set("view engine", "ejs");
server.set("views" , path.resolve('src', 'views'));

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === "development") {
  server.use(morgan('dev'));
}

else if(process.env.NODE_ENV === "production") {
  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
  // console.log(accessLogStream);
}

server.use(express.static("public"));

server.use(express.json({ limit : '500mb'}));
server.use(express.urlencoded({ limit: '500mb', extended: true }));

server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// server.use(express.static(path.join(__dirname, 'uploads')));

server.use(cors());
server.use(xss());
server.use(helmet());

// server.use(cors({
//   origin: 'http://localhost:3000', // React server's URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
//   credentials: true, // If cookies/auth tokens are used
// }));

server.use("/api/v1", app);

server.use("/agreements", viewRoutes);
server.get("/", (req, res) => {
  console.log( "Request ip: ", req.headers['x-forwarded-for'], "remote ip: ", req.connection.remoteAddress);
  res.redirect("/agreements");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

process.on('uncaughtException', (error) => {
  console.error('Unhandled Exception caught:', error.message);
  console.error('Stack Trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});
