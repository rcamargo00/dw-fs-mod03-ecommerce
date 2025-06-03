const Offer = require('../../domain/entities/Offer');
const IOfferRepository = require('../../repositories/OfferRepository');

/*
 * @class CreateOffer
 * @description Caso de uso para crear una nueva oferta o descuento.
 */
class CreateOffer {
  /*
   * @param {IOfferRepository} offerRepository - Implementación del repositorio de ofertas.
   */
  constructor(offerRepository) {
    if (!(offerRepository instanceof IOfferRepository)) {
      throw new Error('offerRepository must be an instance of IOfferRepository');
    }
    this.offerRepository = offerRepository;
  }

  /*
   * Ejecuta el caso de uso para crear una nueva oferta.
   * @param {Object} offerData - Datos de la oferta a crear.
   * @param {string} offerData.name - Nombre de la oferta.
   * @param {string} offerData.type - Tipo de oferta ('percentage', 'fixedAmount', etc.).
   * @param {number} offerData.value - Valor del descuento.
   * @param {Date} offerData.startDate - Fecha de inicio.
   * @param {Date} offerData.endDate - Fecha de fin.
   * @param {string} [offerData.couponCode] - Código del cupón (si aplica).
   * @param {string} [offerData.appliesTo] - Alcance de la oferta.
   * @param {Array<string>} [offerData.productsAffected] - Productos afectados.
   * @param {Array<string>} [offerData.categoriesAffected] - Categorías afectadas.
   * @param {number} [offerData.minimumPurchaseAmount] - Monto mínimo de compra.
   * @param {number} [offerData.usageLimit] - Límite de usos.
   * @param {number} [offerData.maxUsesPerUser] - Máximo de usos por usuario.
   * @returns {Promise<Offer>} La oferta recién creada.
   * @throws {Error} Si los datos de la oferta son inválidos o hay un problema al guardarla.
   */
  async execute(offerData) {
    // 1. Validar los datos de entrada
    if (!offerData.name || !offerData.type || offerData.value === undefined || !offerData.startDate || !offerData.endDate) {
      throw new Error('Missing required offer data: name, type, value, startDate, endDate.');
    }

    // Asegurarse de que las fechas sean objetos Date
    offerData.startDate = new Date(offerData.startDate);
    offerData.endDate = new Date(offerData.endDate);

    if (offerData.startDate >= offerData.endDate) {
      throw new Error('Offer end date must be after start date.');
    }

    // 2. Crear una nueva instancia de la entidad Offer
    // Generar un ID simple para el ejemplo. En un sistema real, usarías un generador de IDs único (ej. UUID).
    const newOfferId = new Date().getTime().toString();
    const offer = new Offer({
      id: newOfferId,
      ...offerData,
    });

    // 3. Guardar la oferta usando el repositorio
    return this.offerRepository.save(offer);
  }
}

module.exports = CreateOffer;