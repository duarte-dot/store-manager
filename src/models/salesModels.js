const connection = require('./db/connection');
const { formatDate } = require('../utils/helpers');

const readAllSales = async () => {
  const [allSales] = await connection.execute(
`SELECT 
    s.id sale_id, s.date, sp.product_id, sp.quantity
FROM
    sales s
        JOIN
    sales_products sp ON s.id = sp.sale_id
ORDER BY sp.product_id;`,
  );
  return allSales;
};

const readSaleByID = async (id) => {
  const [sale] = await connection.execute(
    `SELECT 
    s.date, sp.product_id, sp.quantity
FROM
    sales s
        JOIN
    sales_products sp ON s.id = sp.sale_id
WHERE
    s.id = ?
ORDER BY sp.product_id;`, [id],
  );
  return sale;
};

readAllSales();

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
  readAllSales,
  readSaleByID,
  createNewSale,
  createNewSaleDate,
};