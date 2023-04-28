const salesModels = require('../models/salesModels');
const productsModels = require('../models/productsModels');

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

module.exports = {
  createNewSale,
};