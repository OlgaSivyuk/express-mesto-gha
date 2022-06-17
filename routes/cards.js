const router = require('express').Router();

const { createCard, getCard } = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCard);

module.exports = router;
