const checkProductName = (req, res, next) => {
  const sale = req.body;
  sale.forEach((product) => {
    if (product.quantity === undefined) {
      return res.status(400).json({ message: '"quantity" is required' });
    }
    if (product.quantity <= 0) {
      return res.status(422).json({ message: '"quantity" must be greater than or equal to 1' });
    }
  });
  next();
};

module.exports = checkProductName;