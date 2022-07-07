const mongoose = require('mongoose');
const validator = require('validator');
// const { regexUrl } = require("../constants/regex");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    // required: true,
    validate: {
      // validator(v) {
      //   return /^https?:\/\/(www.)?([\w\-\\.]+)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=,]*/.test(v);
      // },
      validator: (v) => validator.isURL(v),
      // validator: (v) => regexUrl.test(v),
      message: 'Введен некорректный формат ссылки.',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введен некорректный формат email.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
