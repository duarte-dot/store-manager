const checkProductIDOnSale = async (req, res, next) => {
  const sale = req.body;
  
  sale.forEach((product) => {
    if (!product.productId) {
      return next({ status: 400, message: '"productId" is required' });
    }
  });
  next();
};

module.exports = checkProductIDOnSale;