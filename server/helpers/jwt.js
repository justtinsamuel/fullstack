const jwt = require("jsonwebtoken");
const secretCode = "bebas";

const tokenGenerator = (data) => {
  const { id, username, email, image } = data;
  const token = jwt.sign(
    {
      id,
      username,
      email,
      image,
    },
    secretCode
  );

  return token;
};

const tokenVerifier = (data) => {
  const verifiedToken = jwt.verify(data, secretCode);

  return verifiedToken;
};

module.exports = {
  tokenGenerator,
  tokenVerifier,
};
