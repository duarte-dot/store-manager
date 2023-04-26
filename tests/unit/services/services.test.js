const { expect } = require('chai');
const sinon = require('sinon');

const productsServices = require('../../../src/services/productsServices');
const productsModels = require('../../../src/models/productsModels');

describe('Products Services Tests', () => {
  describe('Sucess case', () => {
    afterEach(() => sinon.restore());
    it('readAllProducts', async () => {
      sinon.stub(productsModels, 'readAllProducts').resolves([
        {
          id: 1,
          name: "Martelo de Thor"
        },
        {
          id: 2,
          name: "Traje de encolhimento"
        },
        {
          id: 3,
          name: "Escudo do Capitão América"
        }
      ]);

      const result = await productsServices.readAllProducts();

      expect(result).to.be.an('array');
      expect(result).to.have.length(3);
    });

    it('readProductByID', async () => {
      sinon.stub(productsModels, 'readProductByID').resolves([
        {
          id: 1,
          name: "Martelo de Thor"
        }
      ]);

      const result = await productsServices.readProductByID();

      expect(result).to.be.an('array');
      expect(result).to.have.length(1);
    });
  });
});