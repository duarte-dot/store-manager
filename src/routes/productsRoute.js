const express = require('express');

const router = express.Router();
const productsControllers = require('../controllers/productsControllers');

const checkProductID = require('../middlewares/checkProductID');
const checkProductName = require('../middlewares/checkProductName');

router.get('/', productsControllers.getAllProducts);
router.get('/search', productsControllers.getProductsFromURLSearch);
router.get('/:id', checkProductID, productsControllers.getProductByID);
router.post('/', checkProductName, productsControllers.createNewProduct);
router.put('/:id', checkProductName, productsControllers.updateProduct);
router.delete('/:id', productsControllers.deleteProduct);

module.exports = router;