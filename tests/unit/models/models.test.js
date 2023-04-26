const { expect } = require('chai');
const sinon = require('sinon');

const productsModel = require('../../../src/models/productsModels');
const connection = require('../../../src/models/db/connection');
const { getAllProducts, getProductByID, createMock } = require('./mocks/productsMocks')

describe('Products Models tests', () => {
  afterEach(() => sinon.restore());
  describe('Sucess case', () => {
    it('readAllProducts', async () => {
      sinon.stub(connection, 'execute').resolves([getAllProducts]);

      const result = await productsModel.readAllProducts();

      expect(result).to.be.an('array');
      expect(result).to.have.length(3);
      expect(result[0]).to.contain.keys(['id', 'name']);
    });

    it('readProductByID', async () => {
      sinon.stub(connection, 'execute').resolves([[getProductByID]]);

      const result = await productsModel.readProductByID(1);

      expect(result).to.be.an('array');
      expect(result).to.have.length(1);
      expect(result[0]).to.contain.keys(['id', 'name']);
    });

    it('createNewProduct', async () => {
      sinon.stub(connection, 'execute').resolves([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 1,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        }
      ]);

      const result = await productsModel.createNewProduct({
        name: 'ProdutoX',
      });

      expect(result).to.be.an('object');
      expect(result).to.contain.keys(['id', 'name']);
    })
  });
});