const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const productsControllers = require('../../../src/controllers/productsControllers');
const productsServices = require('../../../src/services/productsServices');

describe('Products Controllers Tests', () => {
  describe('Sucess Case', () => {
    afterEach(() => sinon.restore())
    it('getAllProducts', async () => {
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

    it('getProductByID', async () => {
      const req = { params: { id: 1 } };
      const res = { status: sinon.stub(), json: sinon.stub() };
      const product = { id: 1, name: 'Martelo de Thor' };

      res.status.returns(res);

      sinon.stub(productsServices, 'readProductByID').resolves(product);

      await productsControllers.getProductByID(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
    });

    it('createNewProduct', async () => {
      sinon.stub(productsServices, 'createNewProduct').resolves({
        id: 2, name: 'ProdutoZ' ,
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
  });
});