const checkProductName = (req, res, next) => {
  const sale = req.body;
  sale.forEach((product) => {
    if (product.quantity === undefined) {
      return next({ status: 400, message: '"quantity" is required' });
    }
    if (product.quantity <= 0) {
      return next({ status: 422, message: '"quantity" must be greater than or equal to 1' });
    }
  });
  return next();
};

module.exports = checkProductName;