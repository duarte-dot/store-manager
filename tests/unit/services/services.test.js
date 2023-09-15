const { expect } = require('chai');
const sinon = require('sinon');

const productsServices = require('../../../src/services/productsServices');
const salesServices = require('../../../src/services/salesServices');
const productsModels = require('../../../src/models/productsModels');
const salesModels = require('../../../src/models/salesModels');
const connection = require('../../../src/models/db/connection');
const { object } = require('joi');

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
      sinon.stub(connection, 'execute').resolves()
      sinon.stub(productsModels, 'createNewProduct').resolves({ id: 2, name: 'ProdutoZ' })

      const result = await productsServices.createNewProduct({
        name: 'ProdutoZ'
      })

      expect(result).to.be.an('object');
      expect(result.name).to.be.equal('ProdutoZ');
      expect(result.id).to.be.equal(2);
    });

    it('createNewSale - should create a new sale successfully', async () => {
  sinon.stub(productsModels, 'readProductByID')
    .withArgs(1).resolves({ id: 1, name: 'Martelo de Thor' })
    .withArgs(2).resolves({ id: 2, name: 'Escudo do Capitão América' })
    .withArgs(3).resolves(undefined);

  sinon.stub(salesModels, 'createNewSaleDate').resolves(1);
  sinon.stub(salesModels, 'createNewSale').withArgs(
    { id: 1, productId: 1, quantity: 1 },
    { id: 1, productId: 2, quantity: 2 }
  ).resolves([]);

  sinon.stub(Array.prototype, 'some').returns(false);

  const sale = [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 2 },
    { productId: 3, quantity: 1 },
  ];

  // Testa quando todos os produtos existem no banco de dados
  const result1 = await salesServices.createNewSale(sale);
  expect(result1).to.deep.equal({
    id: 1,
    itemsSold: [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 1 },
    ],
  });
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
    });

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

    it('updateProduct', async () => {
      sinon.stub(productsModels, 'readProductByID').withArgs(2).resolves({ id: 2, name: 'Martelo do Batman' })
      sinon.stub(productsModels, 'updateProduct').resolves(undefined)

      const id = 2
      const name = 'banana'

      const response = {
        id,
        name,
      }

      const result = await productsServices.updateProduct(id, name)

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(response);
    })

    it('should update the sale and return the sale ID and updated items', async () => {
      sinon.stub(salesModels, 'readSaleByID').withArgs(2).resolves([{ date: '2023-05-03T15:27:02.000Z', productId: 3, quantity: 15 }]);
      sinon.stub(productsModels, 'readProductByID').withArgs(1).resolves({ id: 1, name: 'Product 1' });
      sinon.stub(salesModels, 'updateSale').withArgs([
        {
          productId: 1,
          quantity: 10
        },
        {
          productId: 1,
          quantity: 50
        }
      ], 2).resolves(undefined);

      const result = await salesServices.updateSale(2, [
        {
          productId: 1,
          quantity: 10
        },
        {
          productId: 1,
          quantity: 50
        }
      ]);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal({
        saleId: 2,
        itemsUpdated: [
          {
            productId: 1,
            quantity: 10
          },
          {
            productId: 1,
            quantity: 50
          },
        ]
      });
    });

    it('updateSale should call salesModels.updateSale and return the updated sale object', async () => {
      const saleId = 2;
      const updatedSale = [
        {
          productId: 1,
          quantity: 10
        },
        {
          productId: 2,
          quantity: 50
        }
      ];
      const sale = [{
        date: '2023-05-03T15:27:02.000Z',
        productId: 3,
        quantity: 15
      }];
      
      sinon.stub(salesModels, 'readSaleByID').withArgs(saleId).resolves(sale);
      sinon.stub(productsModels, 'readProductByID').resolves({ id: 1, name: 'Product 1' });
      sinon.stub(salesModels, 'updateSale').withArgs(updatedSale, saleId).resolves(undefined);

      const result = await salesServices.updateSale(saleId, updatedSale);

      expect(result).to.be.an('object');
      expect(result).to.deep.equal({
        saleId: saleId,
        itemsUpdated: updatedSale
      });
      expect(salesModels.updateSale.calledOnceWith(updatedSale, saleId)).to.be.true;
    });

    it('deleteSale', async () => {
      sinon.stub(salesModels, 'readSaleByID').withArgs(1).resolves([
        {
          date: '2023-05-03T16:10:30.000Z',
          product_id: 1,
          quantity: 5
        },
        {
          date: '2023-05-03T16:10:30.000Z',
          product_id: 2,
          quantity: 10
        }
      ])
      sinon.stub(salesModels, 'deleteSale').resolves([])

      const result = await salesServices.deleteSale(1)

      expect(result).to.be.an('object')
      expect(result).to.be.deep.equal({ message: 'done' })
    });

    it('getProductsFromURLSearch', async () => {
      sinon.stub(productsModels, 'getProductsFromURLSearch').withArgs('Tra').resolves([{ id: 2, name: 'Traje de encolhimento' }])
      const result = await productsServices.getProductsFromURLSearch('Tra')

      expect(result).to.be.an('array');
      expect(result).to.be.deep.equal([{ id: 2, name: 'Traje de encolhimento' }])
    })

    it('deleteProduct', async () => {
      sinon.stub(productsModels, 'readProductByID').withArgs(1).resolves({ id: 1, name: 'Martelo de Thor' });
      sinon.stub(productsModels, 'deleteProduct').withArgs(1).resolves({ message: 'deleted' })

      const result = await productsServices.deleteProduct(1)

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal({ message: 'deleted' });
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

    it('updateProduct', async () => {
      sinon.stub(productsModels, 'readProductByID').withArgs(404).resolves(undefined)
      sinon.stub(productsModels, 'updateProduct').resolves(undefined)

      const id = 404
      const name = 'banana'

      const response = {
        type: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      }

      const result = await productsServices.updateProduct(id, name)

      expect(result).to.be.an('object');
      expect(result).to.deep.equal(response);
    })

    it('updateSale - Fail sale', async () => {
      sinon.stub(salesModels, 'readSaleByID').withArgs(404).resolves([])
      const result = await salesServices.updateSale(404);

      expect(result).to.be.an('object')
      expect(result).to.be.deep.equal({ type: 'SALE_NOT_FOUND', message: 'Sale not found' })
    });

    it('updateSale - Fail product', async () => {
      sinon.stub(salesModels, 'readSaleByID').withArgs(1).resolves([
        {
          date: '2023-05-03T16:24:39.000Z',
          product_id: 1,
          quantity: 1
        },
        {
          date: '2023-05-03T16:24:39.000Z',
          product_id: 2,
          quantity: 5
        }
      ])
      sinon.stub(productsModels, 'readProductByID').withArgs(1).resolves([
        { id: undefined, name: undefined }
      ])
      
      const result = await salesServices.updateSale(1, [
        {
          productId: 15,
          quantity: 10
        },
        {
          productId: 28,
          quantity: 50
        }
      ]);

      expect(result).to.be.an('object')
      expect(result).to.be.deep.equal({ type: 'PRODUCT_NOT_FOUND', message: 'Product not found' })
    })

    it('deleteSale - fail sale', async () => {
      sinon.stub(salesModels, 'readSaleByID').withArgs(1).resolves([]);

      const result = await salesServices.deleteSale(1);

      expect(result).to.be.an('object')
      expect(result).to.be.deep.equal({ type: 'SALE_NOT_FOUND', message: 'Sale not found' })
    })

    it('getProductsFromURLSearch - fail', async () => {
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
      ])

      const result = await productsServices.getProductsFromURLSearch()

      expect(result).to.be.an('array');
      expect(result).to.be.deep.equal([
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
      ])
    })

    it('deleteProduct - fail', async () => {
      sinon.stub(productsModels, 'readProductByID').withArgs(1).resolves(undefined);

      const result = await productsServices.deleteProduct(1)

      expect(result).to.be.an('object');
      expect(result).to.be.deep.equal({ type: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    })
  });
});