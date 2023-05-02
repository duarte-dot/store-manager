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
    (?, ?, ?);`,
    [id, productId, quantity],
  );
  }
};

const updateSale = async (updatedSale, id) => {
  await connection.execute('DELETE FROM sales_products WHERE sale_id = ?', [id]);

  await Promise.all(
    updatedSale.map(async (sale) => {
      await connection.execute(
        `INSERT INTO sales_products
        (sale_id, product_id, quantity)
        VALUES
        (?, ?, ?);`,
        [id, sale.productId, sale.quantity],
      );
    }),
  );
};

const deleteSale = async (id) => {
  if (id) {
    await connection.execute(
      `DELETE sales, sales_products 
      FROM sales
      JOIN sales_products ON sales.id = sales_products.sale_id
      WHERE sales.id = ?;`, [id],
    );

    return { message: 'deleted' };
  }
};

module.exports = {
  readAllSales,
  readSaleByID,
  createNewSale,
  createNewSaleDate,
  updateSale,
  deleteSale,
};