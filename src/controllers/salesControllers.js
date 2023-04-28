const salesServices = require('../services/salesServices');

const createNewSale = async (req, res) => {
  try {
    const sale = req.body;
    const { type, message, result } = await salesServices.createNewSale(sale);

    if (type) {
      return res.status(404).json({ message });
    }
    console.log(result);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewSale,
};