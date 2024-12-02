const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const privateKey = fs.readFileSync(process.env.JWT_SECRET, "utf8");

function generateToken(payload) {
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS512",
    expiresIn: "1h",
  });
  return token;
}

module.exports = generateToken;
