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

const deleteSale = async (id) => {
  const sale = await readSaleByID(id);

  if (sale.type) return { type: sale.type, message: sale.message };
  
  const response = await salesModels.deleteSale(id);

  return response;
};

module.exports = {
  readSaleByID,
  readAllSales,
  createNewSale,
  deleteSale,
};