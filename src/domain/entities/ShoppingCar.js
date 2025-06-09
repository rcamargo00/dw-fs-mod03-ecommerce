/*
 * @class ShoppingCar
 * @description Representa la entidad del carrito de compras.
 * Contiene la lógica de negocio y las propiedades de un carrito.
 */
class ShoppingCar { 
  /*
   * @param {Object} params - Parámetros para inicializar el carrito.
   * @param {string} params.id - ID único del carrito.
   * @param {string} params.userId - ID del usuario al que pertenece el carrito.
   * @param {Array<Object>} params.items - Lista de ítems en el carrito.
   * @param {string} params.items[].productId - ID del producto.
   * @param {string} params.items[].name - Nombre del producto.
   * @param {string} params.items[].imageUrl - URL de la imagen del producto.
   * @param {number} params.items[].quantity - Cantidad del producto.
   * @param {number} params.items[].priceAtAddToCart - Precio del producto al añadirlo.
   * @param {Object} [params.items[].variant] - Detalles de la variante del producto (ej. { color: 'red', size: 'M' }).
   * @param {number} [params.totalAmount] - Monto total del carrito.
   * @param {Date} [params.createdAt] - Fecha de creación del carrito.
   * @param {Date} [params.updatedAt] - Fecha de última actualización del carrito.
   * @param {string} [params.sessionId] - ID de sesión para carritos de invitados.
   * @param {Object} [params.appliedCoupon] - Detalles del cupón aplicado.
   * @param {string} [params.status] - Estado del carrito (ej. 'active', 'abandoned', 'converted').
   */
  constructor({
    id,
    userId,
    items = [],
    totalAmount = 0,
    createdAt = new Date(),
    updatedAt = new Date(),
    sessionId = null,
    appliedCoupon = null,
    status = 'active'
  }) {
    if (!userId && !sessionId) {
      throw new Error('ShoppingCar must be associated with a userId or a sessionId.');
    }
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.sessionId = sessionId;
    this.appliedCoupon = appliedCoupon;
    this.status = status;
  }
  // Implementación Carrito de compras
  /*-->
   * Añade o actualiza un ítem en el carrito.
   * @param {Object} itemDetails - Detalles del ítem a añadir/actualizar.
   * @param {string} itemDetails.productId - ID del producto.
   * @param {string} itemDetails.name - Nombre del producto.
   * @param {string} itemDetails.imageUrl - URL de la imagen del producto.
   * @param {number} itemDetails.quantity - Cantidad a añadir.
   * @param {number} itemDetails.priceAtAddToCart - Precio unitario del producto.
   * @param {Object} [itemDetails.variant] - Detalles de la variante.
   */
  addItem(itemDetails) {
    const existingItemIndex = this.items.findIndex(item =>
      item.productId === itemDetails.productId &&
      JSON.stringify(item.variant) === JSON.stringify(itemDetails.variant)
    );

    if (existingItemIndex > -1) {
      // Si el ítem ya existe, actualiza la cantidad
      this.items[existingItemIndex].quantity += itemDetails.quantity;
    } else {
      // Si no existe, añade el nuevo ítem
      this.items.push({
        productId: itemDetails.productId,
        name: itemDetails.name,
        imageUrl: itemDetails.imageUrl,
        quantity: itemDetails.quantity,
        priceAtAddToCart: itemDetails.priceAtAddToCart,
        variant: itemDetails.variant || null,
      });
    }
    this.recalculateTotal();
    this.updatedAt = new Date();
  }

  /*
   * Elimina un ítem del carrito.
   * @param {string} productId - ID del producto a eliminar.
   * @param {Object} [variant] - Detalles de la variante a eliminar.
   */
  removeItem(productId, variant = null) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item =>
      !(item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant))
    );
    if (this.items.length < initialLength) {
      this.recalculateTotal();
      this.updatedAt = new Date();
    }
  }

  /*
   * Recalcula el monto total del carrito.
   */
  recalculateTotal() {
    this.totalAmount = this.items.reduce((sum, item) => {
      return sum + (item.quantity * item.priceAtAddToCart);
    }, 0);
  }

  /*
   * Vacía todos los ítems del carrito.
   */
  clearCart() {
    this.items = [];
    this.totalAmount = 0;
    this.updatedAt = new Date();
  }

  /*
   * Convierte la entidad a un objeto plano para almacenamiento.
   * @returns {Object} Objeto plano del carrito.
   */
  toObject() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      sessionId: this.sessionId,
      appliedCoupon: this.appliedCoupon,
      status: this.status,
    };
  }
}

module.exports = ShoppingCar;
