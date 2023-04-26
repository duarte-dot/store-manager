const connection = require('./db/connection');

const readAllProducts = async () => {
  const [allProducts] = await connection.execute(
    'SELECT * FROM products',
  );
  return allProducts;
};

const readProductByID = async (id) => {
  const [[product]] = await connection.execute(
    'SELECT * FROM products WHERE id = ?', [id],
  );
  return product;
};

const createNewProduct = async (name) => {
  const allProducts = await readAllProducts();
  const id = allProducts.length + 1;

  const newProduct = {
    id,
    name,
  };

  await connection.execute(
    'INSERT INTO products (id, name) VALUES (?, ?)', [id, name],
  );

  return newProduct;
};

module.exports = {
  readAllProducts,
  readProductByID,
  createNewProduct,
};