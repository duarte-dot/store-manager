const productsModels = require('../models/productsModels');

const readAllProducts = async () => {
  const allProducts = await productsModels.readAllProducts();
  return allProducts;
};

const readProductByID = async (id) => {
  const product = await productsModels.readProductByID(id);
  return product;
};

module.exports = {
  readAllProducts,
  readProductByID,
};