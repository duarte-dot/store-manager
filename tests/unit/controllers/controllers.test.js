const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const productsControllers = require('../../../src/controllers/productsControllers');
const productsServices = require('../../../src/services/productsServices');
const saleControllers = require('../../../src/controllers/salesControllers');
const saleServices = require('../../../src/services/salesServices');

describe('Products & Sales Controllers Tests', () => {
  afterEach(() => sinon.restore())


  describe('Sucess Case', () => {
    it('getAllProducts - should return a success response with the products', async () => {
      const req = {};
      const res = { status: sinon.stub(), json: sinon.stub() };
      const allProducts = [
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
      ];
      res.status.returns(res);

      sinon.stub(productsServices, 'readAllProducts').resolves(allProducts);

      await productsControllers.getAllProducts(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
    });

    it('getProductByID - should return a success response with the product', async () => {
      const req = { params: { id: 1 } };
      const res = { status: sinon.stub(), json: sinon.stub() };
      const product = { id: 1, name: 'Martelo de Thor' };

      res.status.returns(res);

      sinon.stub(productsServices, 'readProductByID').resolves(product);

      await productsControllers.getProductByID(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
    });

    it('createNewProduct - should return a success response with the created product', async () => {
      sinon.stub(productsServices, 'createNewProduct').resolves({
        id: 2, name: 'ProdutoZ',
      });

      const req = {
        body: {
          name: 'ProdutoZ'
        }
      };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await productsControllers.createNewProduct(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({
        id: 2,
        name: 'ProdutoZ',
      });
    })

    it('createNewSale - should return a success response with sale id and items sold', async () => {
      sinon.stub(saleServices, 'createNewSale').resolves({
        id: 3,
        itemsSold: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ]
      });

      const req = {
        body: [
          {
            "productId": 1,
            "quantity": 1
          },
          {
            "productId": 2,
            "quantity": 5
          }
        ]
      };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.createNewSale(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({
        "id": 3,
        "itemsSold": [
          {
            "productId": 1,
            "quantity": 2
          },
          {
            "productId": 2,
            "quantity": 1
          }
        ]
      });
    });

    it('readAllSales', async () => {
      sinon.stub(saleServices, 'readAllSales').resolves([
        {
          saleId: 1,
          date: '2023-04-28T18:36:01.000Z',
          productId: 1,
          quantity: 5
        },
        {
          saleId: 1,
          date: '2023-04-28T18:36:01.000Z',
          productId: 2,
          quantity: 10
        },
        {
          saleId: 2,
          date: '2023-04-28T18:36:01.000Z',
          productId: 3,
          quantity: 15
        }
      ]);

      const req = {};
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.readAllSales(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([
        {
          saleId: 1,
          date: '2023-04-28T18:36:01.000Z',
          productId: 1,
          quantity: 5
        },
        {
          saleId: 1,
          date: '2023-04-28T18:36:01.000Z',
          productId: 2,
          quantity: 10
        },
        {
          saleId: 2,
          date: '2023-04-28T18:36:01.000Z',
          productId: 3,
          quantity: 15
        }
      ]);
    })

    it('readSaleByID', async () => {
      sinon.stub(saleServices, 'readSaleByID').resolves([
        {
          date: '2023-04-28T18:36:01.000Z',
          productId: 3,
          quantity: 15,
        }
      ]);

      const req = { params: { id: 2 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.readSaleByID(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([
        {
          date: '2023-04-28T18:36:01.000Z',
          productId: 3,
          quantity: 15
        }
      ]);
    })

    it('updateProduct', async () => {
      sinon.stub(productsServices, 'updateProduct').resolves({
        id: 2,
        name: 'banana',
      });

      const req = { params: { id: 2 }, body: { name: 'banana' } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await productsControllers.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        id: 2,
        name: 'banana',
      });
    });

    it('getProductsFromURLSearch', async () => {
      sinon.stub(productsServices, 'getProductsFromURLSearch').withArgs('tra').resolves([{ id: 2, name: 'Traje de encolhimento' }])

      const req = { query: { q: 'Tra' } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await productsControllers.getProductsFromURLSearch(req, res);

      expect(res.status).to.have.been.calledWith(200);
    })

    it('deleteProduct', async () => {
      sinon.stub(productsServices, 'deleteProduct').withArgs(1).resolves(
        { message: 'deleted' }
      )

      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await productsControllers.deleteProduct(req, res);

      expect(res.status).to.have.been.calledWith(204);
    })

    it('updateSale', async () => {
      sinon.stub(saleServices, 'updateSale').withArgs(1, [
        {
          "productId": 1,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ]).resolves({
        saleId: '1',
        itemsUpdated: [{ productId: 1, quantity: 10 }, { productId: 2, quantity: 50 }]
      });
      
      const req = { params: { id: 1 }, body: [
        {
          "productId": 1,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ] };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(200);
    })

    it('deleteSale', async () => {
      sinon.stub(saleServices, 'deleteSale').withArgs(1).resolves({ message: 'done' })

      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.deleteSale(req, res);

      expect(res.status).to.have.been.calledWith(204);
    })
  });

  
  describe('Fail cases', () => {
    it('createNewSale - should return a error response when the productId doesnt exist', async () => {
      sinon.stub(saleServices, 'createNewSale').resolves({
        type: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });

      const req = {
        body: [
          {
            "productId": 999,
            "quantity": 1
          },
          {
            "productId": 1000,
            "quantity": 5
          }
        ]
      };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.createNewSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        message: 'Product not found'
      });
    });

    it('createNewSale - should return a error response if there was an internal error', async () => {
      sinon.stub(saleServices, 'createNewSale').throws(new Error('Internal error creating sale'))

      const req = {
        body: [
          {
            "productId": 999,
            "quantity": 1
          },
          {
            "productId": 1000,
            "quantity": 5
          }
        ]
      };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.createNewSale(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        message: 'Internal error creating sale'
      });
    });

    it('readSaleByID - fail', async () => {
      sinon.stub(saleServices, 'readSaleByID').resolves({
        type: 'SALE_NOT_FOUND',
        message: 'Sale not found'
      });

      const req = { params: { id: 404 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.readSaleByID(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        message: 'Sale not found'
      });
    });

    it('updateProduct - fail', async () => {
      sinon.stub(productsServices, 'updateProduct').resolves({
        type: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      });

      const req = { params: { id: 404 }, body: { name: 'banana' } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await productsControllers.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        message: 'Product not found'
      });
    });

    it('deleteProduct - fail', async () => {
      sinon.stub(productsServices, 'deleteProduct').withArgs(1).resolves(
        { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' }
      )

      const req = { params: { id: 1 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await productsControllers.deleteProduct(req, res);

      expect(res.status).to.have.been.calledWith(404);
    });

    it('updateSale - fail product', async () => {
      sinon.stub(saleServices, 'updateSale').withArgs(1, [
        {
          "productId": 202,
          "quantity": 10
        },
        {
          "productId": 303,
          "quantity": 50
        }
      ]).resolves({ type: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
      
      const req = { params: { id: 1 }, body: [
        {
          "productId": 202,
          "quantity": 10
        },
        {
          "productId": 303,
          "quantity": 50
        }
      ] };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        message: 'Product not found'
      });
    })

    it('updateSale - fail sale', async () => {
      sinon.stub(saleServices, 'updateSale').withArgs(1, [
        {
          "productId": 1,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ]).resolves({ type: 'SALE_NOT_FOUND', message: 'Sale not found' });
      
      const req = { params: { id: 404 }, body: [
        {
          "productId": 1,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ] };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.updateSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        message: 'Sale not found'
      });
    })

    it('deleteSale', async () => {
      sinon.stub(saleServices, 'deleteSale').withArgs(404).resolves({ type: 'SALE_NOT_FOUND', message: 'Sale not found' })

      const req = { params: { id: 404 } };
      const res = {};

      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();

      await saleControllers.deleteSale(req, res);

      expect(res.status).to.have.been.calledWith(404);
      expect(res.json).to.have.been.calledWith({
        message: 'Sale not found'
      });
    })
  });
});