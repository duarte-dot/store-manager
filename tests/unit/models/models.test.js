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
    });
    
    it('updateProduct', async () => {
      sinon.stub(connection, 'execute').resolves([{
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: 'Rows matched: 1  Changed: 1  Warnings: 0',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 1
      }])

      await productsModel.updateProduct(2, "banana");

      expect(connection.execute.args[0][0]).to.equal(
        'UPDATE products SET name = ? WHERE id = ?;',
      );
      expect(connection.execute.args[0][1]).to.deep.equal(['banana', 2]);
    })

    it('deleteProduct', async () => {
      sinon.stub(connection, 'execute').resolves([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        }
      ])

      await productsModel.deleteProduct(1)

      expect(connection.execute.args[0][0]).to.equal(
        'DELETE FROM products WHERE id = ?',
      );
      expect(connection.execute.args[0][1]).to.deep.equal([1]);
    });

    it('getProductsFromURLSearch', async () => {
      sinon.stub(connection, 'execute').resolves([{ id: 2, name: 'Traje de encolhimento' }])

      const q = 'tra'

      await productsModel.getProductsFromURLSearch(q)

      expect(connection.execute.args[0][0]).to.equal(
        'SELECT * FROM products WHERE name LIKE ?',
      );
      expect(connection.execute.args[0][1]).to.deep.equal(
        [`%${q}%`]
      );
    });
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
    (?, ?, ?);`,
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

    it('readAllSales', async () => {
      const result = [
        {
          sale_id: 1,
          date: '2023-04-28T18:36:01.000Z',
          product_id: 1,
          quantity: 5
        },
        {
          sale_id: 1,
          date: '2023-04-28T18:36:01.000Z',
          product_id: 2,
          quantity: 10
        },
        {
          sale_id: 2,
          date: '2023-04-28T18:36:01.000Z',
          product_id: 3,
          quantity: 15
        }
      ]

      sinon.stub(connection, 'execute').resolves(result)

      await salesModel.readAllSales();

      expect(connection.execute.calledOnceWithExactly(`SELECT 
    s.id sale_id, s.date, sp.product_id, sp.quantity
FROM
    sales s
        JOIN
    sales_products sp ON s.id = sp.sale_id
ORDER BY sp.product_id;`)).to.be.true;
    });

    it('readSaleByID', async () => {
      const result = [
        {
          date: '2023-04-28T18:36:01.000Z',
          productId: 3,
          quantity: 15
        }
      ]

      sinon.stub(connection, 'execute').resolves(result)

      await salesModel.readSaleByID(2);

      expect(connection.execute.calledOnceWithExactly(`SELECT 
    s.date, sp.product_id, sp.quantity
FROM
    sales s
        JOIN
    sales_products sp ON s.id = sp.sale_id
WHERE
    s.id = ?
ORDER BY sp.product_id;`, [2])).to.be.true;
    });

    it('updateSale', async () => {
      const updatedSale = [{ productId: 1, quantity: 10 }, { productId: 2, quantity: 5 }];
      const id = 1;

      const executeStub = sinon.stub(connection, 'execute').resolves([]);
      await salesModel.updateSale(updatedSale, id);

      expect(executeStub.callCount).to.equal(3);
      expect(executeStub.getCall(0).args[0]).to.equal('DELETE FROM sales_products WHERE sale_id = ?');
      expect(executeStub.getCall(0).args[1]).to.deep.equal([id]);
      expect(executeStub.getCall(1).args[0]).to.equal(`INSERT INTO sales_products
        (sale_id, product_id, quantity)
        VALUES
        (?, ?, ?);`);
      expect(executeStub.getCall(1).args[1]).to.deep.equal([id, 1, 10]);
      expect(executeStub.getCall(2).args[1]).to.deep.equal([id, 2, 5]);
    });

    it('deleteSale', async () => {
      sinon.stub(connection, 'execute').resolves([{
        fieldCount: 0,
        affectedRows: 2,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      }]);

      await salesModel.deleteSale(1)

      expect(connection.execute.calledOnceWithExactly(`DELETE sales, sales_products 
      FROM sales
      JOIN sales_products ON sales.id = sales_products.sale_id
      WHERE sales.id = ?;`, [1])).to.be.true;
    });
  });
});


describe('Fail case', () => {
  it('createNewSale without sale', async () => {
    sinon.stub(connection, 'execute').resolves({});
      
    const sale = {};
      
    await salesModel.createNewSale(sale);
      
    expect(connection.execute.calledOnce).to.be.false;
      
    connection.execute.restore();
  });
});