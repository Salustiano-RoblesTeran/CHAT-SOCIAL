const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.secretOrPrivateKey,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se puede generar token!");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
