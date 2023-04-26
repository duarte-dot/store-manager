const { expect } = require('chai');
const sinon = require('sinon');

const productsModel = require('../../../src/models/productsModels');
const connection = require('../../../src/models/db/connection');
const { getAllProducts, getProductByID } = require('./mocks/productsMocks')

describe('Products Models tests', () => {
  afterEach(() => sinon.restore());
  describe('Sucess case', () => {
    it('readAllProducts', async () => {
      sinon.stub(connection, 'execute').resolves([getAllProducts]);

      const result = await productsModel.readAllProducts();

      expect(result).to.be.an('array');
      expect(result).to.have.length(3);
      expect(result[0]).to.contain.keys(['id', 'name']);
      connection.execute.restore();
    });
    it('readProductByID', async () => {
      sinon.stub(connection, 'execute').resolves([getProductByID]);

      const result = await productsModel.readProductByID(1);

      expect(result).to.be.an('array');
      expect(result).to.have.length(1);
      expect(result[0]).to.contain.keys(['id', 'name']);
    });
  });
});