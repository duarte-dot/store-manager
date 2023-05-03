const productsServices = require('../services/productsServices');

const getAllProducts = async (_req, res) => {
  const allProducts = await productsServices.readAllProducts();
  return res.status(200).json(allProducts);
};

const getProductByID = async (req, res) => {
  const { id } = req.params;
  const product = await productsServices.readProductByID(id);
  return res.status(200).json(product);
};

const getProductsFromURLSearch = async (req, res) => {
  const { q } = req.query;

  const selectedProducts = await productsServices.getProductsFromURLSearch(q);
  return res.status(200).json(selectedProducts);
};

const createNewProduct = async (req, res) => {
  const { name } = req.body;
  const product = await productsServices.createNewProduct(name);

  return res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const response = await productsServices.updateProduct(id, name);

  if (response.type) {
    return res.status(404).json({ message: response.message });
  }

  res.status(200).json(response);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const response = await productsServices.deleteProduct(id);
  console.log(response);

  if (response.type) {
    return res.status(404).json({ message: response.message });
  }

  res.status(204).json({});
};

module.exports = {
  getAllProducts,
  getProductByID,
  getProductsFromURLSearch,
  createNewProduct,
  updateProduct,
  deleteProduct,
};