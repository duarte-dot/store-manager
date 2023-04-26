const express = require('express');

const router = express.Router();
const productsControllers = require('../controllers/productsControllers');

const checkProductID = require('../middlewares/checkProductID');

router.get('/', productsControllers.getAllProducts);
router.get('/:id', checkProductID, productsControllers.getProductByID);

module.exports = router;