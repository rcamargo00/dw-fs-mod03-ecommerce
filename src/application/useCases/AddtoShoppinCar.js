const ShoppingCar = require('../../domain/entities/ShoppingCar');
const IShoppingCarRepository = require('../../repositories/ShoppingCarRepository');

/*
 * @class AddToShoppingCar
 * @description Caso de uso para añadir un producto al carrito de compras de un usuario.
 */
class AddToShoppingCar {
  /*
   * @param {IShoppingCarRepository} shoppingCarRepository - Implementación del repositorio de carritos de compras.
   * @param {IProductRepository} productRepository - Implementación del repositorio de productos (asumido para obtener detalles del producto).
   */
  constructor(shoppingCarRepository, productRepository) {
    if (!(shoppingCarRepository instanceof IShoppingCarRepository)) {
      throw new Error('shoppingCarRepository must be an instance of IShoppingCarRepository');
    }
    // En un escenario real, productRepository sería una interfaz similar a IShoppingCarRepository
    // y se usaría para obtener los detalles del producto por su ID.
    // Por simplicidad en este ejemplo, asumiremos que los detalles básicos del producto
    // se pasan directamente o que el productRepository tiene un método 'findById'.
    this.shoppingCarRepository = shoppingCarRepository;
    this.productRepository = productRepository; // Asumimos que existe y tiene un método para buscar productos
  }

  /*
   * Ejecuta el caso de uso para añadir un producto al carrito.
   * @param {Object} params - Parámetros para añadir el producto.
   * @param {string} [params.userId] - ID del usuario (si está autenticado).
   * @param {string} [params.sessionId] - ID de la sesión (para usuarios no autenticados).
   * @param {string} params.productId - ID del producto a añadir.
   * @param {number} params.quantity - Cantidad del producto a añadir.
   * @param {Object} [params.variant] - Detalles de la variante del producto.
   * @returns {Promise<ShoppingCar>} El carrito de compras actualizado.
   * @throws {Error} Si el producto no se encuentra o hay un problema con el carrito.
   */
  async execute(params) {
    const { userId, sessionId, productId, quantity, variant } = params;

    if (!userId && !sessionId) {
      throw new Error('A userId or sessionId is required to add items to a shopping cart.');
    }
    if (!productId || quantity <= 0) {
      throw new Error('Product ID and a positive quantity are required.');
    }

    // 1. Obtener los detalles del producto (simulación)
    // En un caso real, esto vendría de this.productRepository.findById(productId)
    // y se verificaría el stock.
    const productDetails = await this.productRepository.findById(productId); // Asumiendo que productRepository tiene este método
    if (!productDetails) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    // Aquí podríamos añadir lógica para verificar el stock
    // if (productDetails.stock < quantity) {
    //   throw new Error('Insufficient stock for this product.');
    // }

    // 2. Encontrar o crear el carrito de compras
    let shoppingCart = await this.shoppingCarRepository.findByUserIdOrSessionId(userId, sessionId);

    if (!shoppingCart) {
      // Si no existe, crear un nuevo carrito
      const newCartId = new Date().getTime().toString(); // Generar un ID simple para el ejemplo
      shoppingCart = new ShoppingCar({
        id: newCartId,
        userId: userId,
        sessionId: sessionId,
      });
    }

    // 3. Añadir el ítem al carrito
    shoppingCart.addItem({
      productId: productDetails.id,
      name: productDetails.name,
      imageUrl: productDetails.imageUrl, // Asumiendo que el producto tiene una URL de imagen
      quantity: quantity,
      priceAtAddToCart: productDetails.price, // Asumiendo que el producto tiene un precio
      variant: variant,
    });

    // 4. Guardar o actualizar el carrito en el repositorio
    if (shoppingCart.id) {
      return this.shoppingCarRepository.update(shoppingCart);
    } else {
      return this.shoppingCarRepository.save(shoppingCart);
    }
  }
}

module.exports = AddToShoppingCar;