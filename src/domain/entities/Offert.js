/*
 * @class Offer
 * @description Representa la entidad de una oferta o descuento.
 * Contiene la lógica de negocio y las propiedades de una oferta.
 */
class Offer {
  /*
   * @param {Object} params - Parámetros para inicializar la oferta.
   * @param {string} params.id - ID único de la oferta.
   * @param {string} params.name - Nombre descriptivo de la oferta.
   * @param {string} params.type - Tipo de oferta ('percentage', 'fixedAmount', 'freeShipping', 'buyOneGetOne', 'couponCode').
   * @param {number} params.value - Valor de la oferta (ej. 10 para 10%, 25 para $25).
   * @param {number} [params.minimumPurchaseAmount] - Cantidad mínima de compra para aplicar.
   * @param {Date} params.startDate - Fecha de inicio de validez.
   * @param {Date} params.endDate - Fecha de fin de validez.
   * @param {boolean} [params.isActive] - Estado activo/inactivo.
   * @param {number} [params.usageLimit] - Límite de usos totales.
   * @param {number} [params.usedCount] - Contador de usos actuales.
   * @param {string} [params.appliesTo] - Alcance de la oferta ('allProducts', 'specificProducts', 'specificCategories').
   * @param {Array<string>} [params.productsAffected] - IDs de productos afectados.
   * @param {Array<string>} [params.categoriesAffected] - IDs de categorías afectadas.
   * @param {string} [params.couponCode] - Código del cupón (si aplica).
   * @param {number} [params.buyQuantity] - Cantidad a comprar para BOGO.
   * @param {number} [params.getQuantity] - Cantidad a obtener para BOGO.
   * @param {number} [params.getDiscountPercentage] - % de descuento en ítems "get" para BOGO.
   * @param {Array<string>} [params.usersAllowed] - IDs de usuarios específicos permitidos.
   * @param {number} [params.maxUsesPerUser] - Máximo de usos por usuario.
   * @param {Date} [params.createdAt] - Fecha de creación.
   * @param {Date} [params.updatedAt] - Fecha de última actualización.
   */
  constructor({
    id,
    name,
    type,
    value,
    minimumPurchaseAmount = 0,
    startDate,
    endDate,
    isActive = true,
    usageLimit = null,
    usedCount = 0,
    appliesTo = 'allProducts',
    productsAffected = [],
    categoriesAffected = [],
    couponCode = null,
    buyQuantity = null,
    getQuantity = null,
    getDiscountPercentage = null,
    usersAllowed = [],
    maxUsesPerUser = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    if (!id || !name || !type || value === undefined || !startDate || !endDate) {
      throw new Error('Offer must have id, name, type, value, startDate, and endDate.');
    }
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = value;
    this.minimumPurchaseAmount = minimumPurchaseAmount;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isActive = isActive;
    this.usageLimit = usageLimit;
    this.usedCount = usedCount;
    this.appliesTo = appliesTo;
    this.productsAffected = productsAffected;
    this.categoriesAffected = categoriesAffected;
    this.couponCode = couponCode;
    this.buyQuantity = buyQuantity;
    this.getQuantity = getQuantity;
    this.getDiscountPercentage = getDiscountPercentage;
    this.usersAllowed = usersAllowed;
    this.maxUsesPerUser = maxUsesPerUser;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
module.exports = Offer;