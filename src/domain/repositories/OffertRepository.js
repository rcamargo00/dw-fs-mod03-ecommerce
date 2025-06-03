/*
 * @interface IOfferRepository
 * @description Interfaz abstracta para el repositorio de ofertas.
 * Define los métodos que cualquier implementación concreta del repositorio debe tener.
 */
class IOfferRepository {
  /*
   * Encuentra una oferta por su ID.
   * @param {string} offerId - El ID de la oferta.
   * @returns {Promise<Offer | null>} La oferta o null si no se encuentra.
   */
  async findById(offerId) {
    throw new Error('Method "findById" must be implemented.');
  }

  /*
   * Encuentra todas las ofertas activas.
   * @returns {Promise<Array<Offer>>} Una lista de ofertas activas.
   */
  async findActiveOffers() {
    throw new Error('Method "findActiveOffers" must be implemented.');
  }

  /*
   * Guarda una nueva oferta.
   * @param {Offer} offer - La entidad de la oferta a guardar.
   * @returns {Promise<Offer>} La oferta guardada.
   */
  async save(offer) {
    throw new Error('Method "save" must be implemented.');
  }

  /*
   * Actualiza una oferta existente.
   * @param {Offer} offer - La entidad de la oferta a actualizar.
   * @returns {Promise<Offer>} La oferta actualizada.
   */
  async update(offer) {
    throw new Error('Method "update" must be implemented.');
  }

  /*
   * Elimina una oferta por su ID.
   * @param {string} offerId - El ID de la oferta a eliminar.
   * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
   */
  async delete(offerId) {
    throw new Error('Method "delete" must be implemented.');
  }
}

module.exports = IOfferRepository;