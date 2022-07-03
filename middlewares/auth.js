const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  console.log('is authorized');
  const token = req.cookies.jwt;
  console.log('auth', token);

  if (!token) {
    const error = new Error('Нужно авторизоваться для доступа');
    error.statusCode = 403;
    throw error;
    // return res.status(401).send({ message: 'Нужно авторизоваться для доступа' });
  }

  // const token = authorization.replace('Bearer ', '');
  let payload;

  console.log('token', token);

  try {
    payload = jwt.verify(token, 'very_secret');
  } catch (err) {
    const error = new Error('Нужно авторизоваться для доступа');
    err.statusCode = 403;
    throw error;
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
  console.log(payload);
  req.user = payload;
  next();
};
