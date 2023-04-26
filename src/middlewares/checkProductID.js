const { readAllProducts } = require('../models/productsModels');

const checkProductID = async (req, res, next) => {
  const products = await readAllProducts();
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return next();
};

module.exports = checkProductID;