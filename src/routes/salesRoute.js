const express = require('express');

const router = express.Router();
const salesControllers = require('../controllers/salesControllers');

const checkProductIDOnSale = require('../middlewares/checkProductIDOnSale');
const checkQuantityOnSale = require('../middlewares/checkQuantityOnSale');

router.post('/', checkProductIDOnSale, checkQuantityOnSale, salesControllers.createNewSale);

module.exports = router;