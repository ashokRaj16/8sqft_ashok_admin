import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

if (process.env.DB_PASSWORD === undefined) {
  console.warn("Warning: DB_PASSWORD is not set. Using an empty password.");
}

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "", 
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    connectTimeout: 60000, // 60 seconds
  });

  pool.on('acquire', () => {
    console.log("Connection acquired");
  });
  
  pool.on('release', () => {
    console.log("Connection released");
  });
  
  pool.on('error', (err) => {
    console.error("Database error:", err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error("Reconnecting to the database...");
    }
  });
  
  console.log("MySQL connection pool created successfully.");
} catch (err) {
  console.error("Error creating MySQL connection pool:", err.message);
  process.exit(1);
}

export default pool;
