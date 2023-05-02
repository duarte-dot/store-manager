const salesServices = require('../services/salesServices');

const readAllSales = async (_req, res) => {
  const allSales = await salesServices.readAllSales();
  return res.status(200).json(allSales);
};

const readSaleByID = async (req, res) => {
  const { id } = req.params;
  const sale = await salesServices.readSaleByID(id);

  if (sale.type) {
    return res.status(404).json({ message: sale.message });
  }
  return res.status(200).json(sale);
};

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

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = req.body;

    const response = await salesServices.updateSale(id, sale);

    if (response.type) {
      return res.status(404).json({ message: response.message });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await salesServices.deleteSale(id);

    if (response.type) return res.status(404).json({ message: response.message });

    return res.status(204).json({});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 

module.exports = {
  readAllSales,
  readSaleByID,
  createNewSale,
  updateSale,
  deleteSale,
};