const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authorization-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  console.log('is authorized');
  const token = req.cookies.jwt;
  console.log('auth', token);

  if (!token) {
    next(new AuthorizationError('Нужно авторизоваться для доступа.'));
    return;
  }

  let payload;

  console.log('token', token);

  try {
    payload = jwt.verify(token, 'very_secret');
  } catch (err) {
    next(new AuthorizationError('Нужно авторизоваться для доступа.'));
    return;
  }
  console.log(payload);
  req.user = payload;
  next();
};
