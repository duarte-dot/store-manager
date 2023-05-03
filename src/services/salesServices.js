const salesModels = require('../models/salesModels');
const productsModels = require('../models/productsModels');
const { camelize } = require('../utils/helpers');

const readAllSales = async () => {
  const allSales = await salesModels.readAllSales();
  return camelize(allSales);
};

const readSaleByID = async (id) => {
  const saleFound = await salesModels.readSaleByID(id);

  if (saleFound.length === 0) {
    return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };
  }

  return camelize(saleFound);
};

const createNewSale = async (sale) => {
  const verifySales = await Promise.all(
    sale.map((product) => productsModels.readProductByID(product.productId)),
  );

  const validate = verifySales.some(
    (s) => s === undefined || s.id === undefined || s.name === undefined,
  );

  if (validate) return { type: 'PRODUCT_NOT_FOUD', message: 'Product not found' };

  const id = await salesModels.createNewSaleDate();

  await Promise.all(
    sale.map((product) => salesModels.createNewSale({ id, ...product })),
  );

  const itemsSold = sale.map(
    (product) => ({ productId: product.productId, quantity: product.quantity }),
  );

  return {
    id,
    itemsSold,
  };
};

const updateSale = async (id, updatedSale) => {
  const sale = await salesModels.readSaleByID(id);

  if (sale.length === 0) return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };

  const verifySales = await Promise.all(
    updatedSale.map((product) => productsModels.readProductByID(product.productId)),
  );

  const validate = verifySales.some(
    (s) => s === undefined || s.id === undefined || s.name === undefined,
  );

  if (validate) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };

  await salesModels.updateSale(updatedSale, id);

  return {
    saleId: id,
    itemsUpdated: updatedSale,
  };
};

const deleteSale = async (id) => {
  const sale = await salesModels.readSaleByID(id);

  if (sale.length === 0) return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };
  
  await salesModels.deleteSale(id);

  return { message: 'done' };
};

module.exports = {
  readSaleByID,
  readAllSales,
  createNewSale,
  updateSale,
  deleteSale,
};