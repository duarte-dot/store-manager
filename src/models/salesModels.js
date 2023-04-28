const connection = require('./db/connection');
const { formatDate } = require('../utils/helpers');

// const readAllSales = async () => {
//   const [allSales] = await connection.execute(
//     'SELECT * FROM sales',
//   );
//   return allSales;
// };

const createNewSaleDate = async () => {
  const date = formatDate();
  const [{ insertId }] = await connection.execute('INSERT INTO sales (date) VALUES (?)', [date]);
  return insertId;
};

const createNewSale = async ({ id, productId, quantity }) => {
  if (id && productId && quantity) {
  await connection.execute(
    `INSERT INTO sales_products 
    (sale_id, product_id, quantity) 
    VALUES
    (?, ?, ?)`,
    [id, productId, quantity],
  );
  }
};

module.exports = {
  createNewSale,
  createNewSaleDate,
};