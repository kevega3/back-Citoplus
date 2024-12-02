const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./middleware/auth");
const app = express();
const port = 3000;
const config = require("./config");
const generateToken = require("./middleware/generateToken");
app.use(cors());

app.use(express.json());

sql
  .connect(config.database)
  .then((pool) => {
    app.post("/Citoplus/Usuario", async (req, res) => {
      try {
        var response = {};
        const { email, password } = req.body;
        const result = await pool
          .request()
          .input("email", sql.VarChar(100), email)
          .input("password", sql.VarChar(100), password)
          .execute("BuscarUsuarioPorEmailYPassword");

        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          const token = generateToken({ id: user.id, email: user.email });

          response = {
            error: false,
            ayuda: "Logeo Exitoso",
            data: token,
          };
          res.status(200).send(response);
        } else {
          response = {
            error: true,
            ayuda: "Usuario o Contraseña incorrecta",
            data: result.recordset,
          };
          res.status(200).send(response);
        }
      } catch (err) {
        res.status(500).send({
          error: true,
          ayuda: err.message,
        });
      }
    });
  })
  .catch((err) => {
    console.error("SQL connection error", err);
    res.status(500).send({
      error: true,
      ayuda: err.message,
    });
  });

sql
  .connect(config.database)
  .then((pool) => {
    app.post("/Citoplus/Visitantes", auth, async (req, res) => {
      try {
        const {
          Nombre = "",
          FechaVisita = null,
          NumeroIdentificacion = "",
        } = req.body;
        let variables = { Nombre, FechaVisita, NumeroIdentificacion };

        const result = await pool
          .request()
          .input("Nombre", sql.VarChar(100), variables.Nombre)
          .input("FechaVisita", sql.Date, variables.FechaVisita)
          .input(
            "NumeroIdentificacion",
            sql.VarChar(50),
            variables.NumeroIdentificacion
          )
          .execute("sp_Visitantes");

        let response = {
          error: false,
          ayuda: "visitantes",
          data: result.recordset,
        };
        res.status(200).send(response);
      } catch (err) {
        res.status(500).send({
          error: true,
          ayuda: err.message,
        });
      }
    });
  })
  .catch((err) => {
    console.error("SQL connection error", err);
    res.status(500).send({
      error: true,
      ayuda: err.message,
    });
  });

app.listen(port, () => {
  console.log(`Servidor Corriendo con http://localhost:${port}`);
});
