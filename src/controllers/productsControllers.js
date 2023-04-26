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

const createNewProduct = async (req, res) => {
  const { name } = req.body;
  const product = await productsServices.createNewProduct(name);
  return res.status(201).json(product);
};

module.exports = {
  getAllProducts,
  getProductByID,
  createNewProduct,
};