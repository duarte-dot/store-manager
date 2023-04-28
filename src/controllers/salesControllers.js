const salesServices = require('../services/salesServices');

const createNewSale = async (req, res) => {
  try {
    const sale = req.body;
    const { type, message, id, itemsSold } = await salesServices.createNewSale(sale);

    if (type) {
      return res.status(404).json({ message });
    }
    
    return res.status(201).json({ id, itemsSold });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewSale,
};