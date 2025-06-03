const CreateProduct = require('../../application/useCases/CreateProduct');
const ProductDTO = require('../../application/dtos/ProductDTO');
 
class ProductController {
  constructor(productRepository) {
    this.createProduct = new CreateProduct(productRepository);
  }
 
  async create(req, res) {
    try {
      const product = await this.createProduct.execute(req.body);
      res.status(201).json(new ProductDTO(product));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
 
module.exports = ProductController;