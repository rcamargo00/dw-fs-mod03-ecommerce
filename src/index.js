const express = requiere('express');
const config = requiere('./config')
const MongoProductRepository = require("./infraestructure/repositories/MongoProductRepository");
const ProductController = require('./adapters/controllers/ProductController');
const productRoutes = require('./adapters/routes/productRouters');
const {verifyToken} = require('./adapters/middlewares/authJwt')

const app = express();
const port = config.port;
// Dependencies 
const productRepository = new MongoProductRepository()
const productController = new ProductController(productRepository);
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
// Routes
app.use('/api/v1/products', verifyToken, productRoutes(productController));
 
// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});
 
// Start Server
app.listen(port, () => {
  console.log(`E-commerce server running on port ${port}`);
});