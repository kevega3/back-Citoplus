const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const fs = require("fs");
const config = {
  database: {
    server: process.env.SQHOST,
    user: process.env.SQUSER,
    password: process.env.SQPASSWORD,
    name: process.env.SQDATABASE,
    database: process.env.SQDATABASE,
    options: {
      encrypt: true, // Use encryption
      trustServerCertificate: true, // Trust the self-signed certificate
    },
  },
};

module.exports = {
  ...config,
  jwtSecret: fs.readFileSync(process.env.JWT_PUBLIC, "utf8"),
  jwtExpiresIn: "1h", // Tiempo de expiración del token
};
