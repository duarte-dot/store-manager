const connection = require('./db/connection');

const readAllProducts = async () => {
  const [allProducts] = await connection.execute(
    'SELECT * FROM products',
  );
  return allProducts;
};

const readProductByID = async (id) => {
  const [product] = await connection.execute(
    'SELECT * FROM products WHERE id = ?', [id],
  );
  return product;
};

module.exports = {
  readAllProducts,
  readProductByID,
};