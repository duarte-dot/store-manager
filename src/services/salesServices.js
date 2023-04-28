const salesModels = require('../models/salesModels');
const productsModels = require('../models/productsModels');

const createNewSale = async (sales) => {
  const verifySales = await Promise.all(
    sales.map((product) => productsModels.readProductByID(product.productId)),
  );

  const validate = verifySales.some((sale) => sale === undefined);

  if (validate) return { type: 'PRODUCT_NOT_FOUD', message: 'Product not found' };

  const id = await salesModels.createNewSaleDate();

  await Promise.all(
    sales.map((product) => salesModels.createNewSale({ ...product, id })),
  );
  return {
    result: { id, itemsSold: sales },
  };
};

module.exports = {
  createNewSale,
};