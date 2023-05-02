const express = require('express');

const router = express.Router();
const salesControllers = require('../controllers/salesControllers');

const checkProductIDOnSale = require('../middlewares/checkProductIDOnSale');
const checkQuantityOnSale = require('../middlewares/checkQuantityOnSale');

router.get('/', salesControllers.readAllSales);
router.get('/:id', salesControllers.readSaleByID);
router.post('/', checkProductIDOnSale, checkQuantityOnSale, salesControllers.createNewSale);
router.put('/:id', checkProductIDOnSale, checkQuantityOnSale, salesControllers.updateSale);
router.delete('/:id', salesControllers.deleteSale);

module.exports = router;