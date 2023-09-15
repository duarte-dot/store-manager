const productsModels = require('../models/productsModels');

const readAllProducts = async () => {
  const allProducts = await productsModels.readAllProducts();
  return allProducts;
};

const readProductByID = async (id) => {
  const product = await productsModels.readProductByID(id);
  return product;
};

const getProductsFromURLSearch = async (q) => {
  if (!q) {
    const allProducts = await productsModels.readAllProducts();
    return allProducts;
  }

  const selectedProducts = await productsModels.getProductsFromURLSearch(q);
  return selectedProducts;
};

const createNewProduct = async (name) => {
  const product = await productsModels.createNewProduct(name);
  return product;
};

const updateProduct = async (id, name) => {
  const product = await productsModels.readProductByID(id);

  if (!product) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  
  await productsModels.updateProduct(id, name);

  const response = {
    id,
    name,
  };

  return response;
};

const deleteProduct = async (id) => {
  const product = await productsModels.readProductByID(id);

  if (!product) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  
  const response = await productsModels.deleteProduct(id);
  return response;
};

module.exports = {
  readAllProducts,
  readProductByID,
  getProductsFromURLSearch,
  createNewProduct,
  updateProduct,
  deleteProduct,
};