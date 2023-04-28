const { expect } = require('chai');
const sinon = require('sinon');

const { formatDate } = require('../../../src/utils/helpers');

const productsModel = require('../../../src/models/productsModels');
const salesModel = require('../../../src/models/salesModels')
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

describe('Sales Models Tests', () => {
  afterEach(() => sinon.restore());


  describe('Sucess case', () => {
    it('createNewSale with 1 sale', async () => {
      sinon.stub(connection, 'execute').resolves({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      })
      
      const sale = { id: 1, productId: 2, quantity: 3 };
      
      await salesModel.createNewSale(sale, connection);
      
      expect(connection.execute.calledOnce).to.be.true;
      expect(connection.execute.args[0][0]).to.equal(
        `INSERT INTO sales_products 
    (sale_id, product_id, quantity) 
    VALUES
    (?, ?, ?)`,
      );
      expect(connection.execute.args[0][1]).to.deep.equal([1, 2, 3]);
    });

    it('createNewSaleDate', async () => {
      const result = {
        insertId: 5
      };
      sinon.stub(connection, 'execute').resolves([result]);

      const id = await salesModel.createNewSaleDate();

      expect(connection.execute.calledOnceWithExactly('INSERT INTO sales (date) VALUES (?)', [formatDate()])).to.be.true;
      expect(id).to.equal(result.insertId);
    });
  })


  describe('Fail case', () => {
    it('createNewSale without sale', async () => {
    sinon.stub(connection, 'execute').resolves({});
    
    const sale = {};
    
    await salesModel.createNewSale(sale);
    
    expect(connection.execute.calledOnce).to.be.false;
    
    connection.execute.restore();
  })
  })
})