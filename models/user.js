const mongoose = require('mongoose');
const validator = require('validator');

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
    validator: {
      validator(value) {
        return /https?:\W{2}[www]?\W?([2-domains]|[-?\w+]+)[\Wru]([\W\w{2,}]?)*\W?.+#?/.test(value);
      },
      // message: 'введен некорректный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    validator: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'введен некорректный формат email',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
