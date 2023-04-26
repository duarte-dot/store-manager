const express = require('express');

const router = express.Router();
const productsControllers = require('../controllers/productsControllers');

const checkProductID = require('../middlewares/checkProductID');
const checkProductName = require('../middlewares/checkProductName');

router.get('/', productsControllers.getAllProducts);
router.get('/:id', checkProductID, productsControllers.getProductByID);
router.post('/', checkProductName, productsControllers.createNewProduct);

module.exports = router;