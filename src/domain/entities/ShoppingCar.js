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
}

module.exports = ShoppingCar;
