const { expect } = require('chai');
const sinon = require('sinon');

const productsServices = require('../../../src/services/productsServices');
const salesServices = require('../../../src/services/salesServices');
const productsModels = require('../../../src/models/productsModels');
const salesModels = require('../../../src/models/salesModels');

describe('Products Services Tests', () => {
  afterEach(() => sinon.restore());


  describe('Sucess case', () => {
    it('readAllProducts - should read all products successfully', async () => {
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

    it('readProductByID - should read a product by id successfully', async () => {
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

    it('createNewProduct - should create a new product successfully', async () => {
      sinon.stub(productsModels, 'createNewProduct').resolves({ id: 2, name: 'ProdutoZ' })

      const result = await productsServices.createNewProduct({
        name: 'ProdutoZ'
      })

      expect(result).to.be.an('object');
      expect(result.name).to.be.equal('ProdutoZ');
      expect(result.id).to.be.equal(2);
    })

    it('createNewSale - should create a new sale successfully', async () => {
      const sale = [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ];

      const createNewSaleDateStub = sinon.stub(salesModels, 'createNewSaleDate').resolves(1);

      const createNewSaleStub = sinon.stub(salesModels, 'createNewSale').resolves();

      const result = await salesServices.createNewSale(sale);

      expect(result).to.deep.equal({
        id: 1,
        itemsSold: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 2 },
        ],
      });
      expect(createNewSaleDateStub.calledOnce).to.be.true;
      expect(createNewSaleStub.calledTwice).to.be.true;
    });

    it('readAllSales', async () => {
      const salesModelsStub = sinon.stub(salesModels, 'readAllSales').resolves([
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
      ])

      const resultStub = [
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
      ]

      const result = await salesServices.readAllSales();

      expect(salesModelsStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(resultStub);
    })

    it('readSaleByID', async () => {
      sinon.stub(salesModels, 'readSaleByID').resolves([
        {
          date: '2023-04-28T18:36:01.000Z',
          product_id: 3,
          quantity: 15
        }
      ]);

      const resultStub = [
        {
          date: '2023-04-28T18:36:01.000Z',
          productId: 3,
          quantity: 15
        }
      ]

      const result = await salesServices.readSaleByID(2)

      expect(result).to.deep.equal(resultStub);
    })
  });


  describe('Fail case', () => {
    it('createNewSale - should return "Product not found" when at least one product does not exist', async () => {
      const sale = [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ];

      const readProductByIDStub = sinon.stub(productsModels, 'readProductByID');
      readProductByIDStub.withArgs(1).resolves({ id: 1, name: 'Product 1' });
      readProductByIDStub.withArgs(2).resolves(undefined);

      const result = await salesServices.createNewSale(sale);

      expect(result).to.deep.equal({
        type: 'PRODUCT_NOT_FOUD',
        message: 'Product not found',
      });
      expect(readProductByIDStub.calledTwice).to.be.true;
    });

    it('readSaleByID - should return "Sale not found" when there is no sales with that id', async () => {
      sinon.stub(salesModels, 'readSaleByID').resolves([])

      const resultStub = { type: 'SALE_NOT_FOUND', message: 'Sale not found' };

      const result = await salesServices.readSaleByID(404)

      expect(result).to.deep.equal(resultStub);
    })
  });
});