const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: true, ayuda: `No se detecta token` });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ["RS512"],
    });
    req.user = decoded;
    next();
  } catch (ex) {
    res
      .status(400)
      .send({ error: true, ayuda: `Token Invalido ${ex.message}` });
  }
};
