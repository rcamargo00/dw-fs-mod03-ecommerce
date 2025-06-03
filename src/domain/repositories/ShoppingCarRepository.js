/*
 * @interface IShoppingCarRepository
 * @description Interfaz abstracta para el repositorio de carritos de compras.
 * Define los métodos que cualquier implementación concreta del repositorio debe tener.
 */
class IShoppingCarRepository {
  /*
   * Encuentra un carrito de compras por su ID.
   * @param {string} cartId - El ID del carrito.
   * @returns {Promise<ShoppingCar | null>} El carrito de compras o null si no se encuentra.
   */
  async findById(cartId) {
    throw new Error('Method "findById" must be implemented.');
  }

  /*
   * Encuentra un carrito de compras por ID de usuario o ID de sesión.
   * @param {string} userId - El ID del usuario.
   * @param {string} [sessionId] - El ID de la sesión (para carritos de invitados).
   * @returns {Promise<ShoppingCar | null>} El carrito de compras o null si no se encuentra.
   */
  async findByUserIdOrSessionId(userId, sessionId) {
    throw new Error('Method "findByUserIdOrSessionId" must be implemented.');
  }

  /*
   * Guarda un nuevo carrito de compras.
   * @param {ShoppingCar} shoppingCar - La entidad del carrito de compras a guardar.
   * @returns {Promise<ShoppingCar>} El carrito de compras guardado.
   */
  async save(shoppingCar) {
    throw new Error('Method "save" must be implemented.');
  }

  /*
   * Actualiza un carrito de compras existente.
   * @param {ShoppingCar} shoppingCar - La entidad del carrito de compras a actualizar.
   * @returns {Promise<ShoppingCar>} El carrito de compras actualizado.
   */
  async update(shoppingCar) {
    throw new Error('Method "update" must be implemented.');
  }

  /*
   * Elimina un carrito de compras por su ID.
   * @param {string} cartId - El ID del carrito a eliminar.
   * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
   */
  async delete(cartId) {
    throw new Error('Method "delete" must be implemented.');
  }
}

module.exports = IShoppingCarRepository;