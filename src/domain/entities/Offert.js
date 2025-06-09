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
  
  // Implementación
  
  /*
   * Verifica si la oferta es válida en la fecha actual.
   * @returns {boolean} True si la oferta está activa y dentro de su período de validez.
   */
  isValid() {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
  }

  /*
   * Incrementa el contador de usos de la oferta.
   * @returns {boolean} True si el contador se incrementó, false si se alcanzó el límite.
   */
  incrementUsage() {
    if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
      return false; // Límite de uso alcanzado
    }
    this.usedCount++;
    this.updatedAt = new Date();
    return true;
  }

  /*
   * Convierte la entidad a un objeto plano para almacenamiento.
   * @returns {Object} Objeto plano de la oferta.
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      value: this.value,
      minimumPurchaseAmount: this.minimumPurchaseAmount,
      startDate: this.startDate,
      endDate: this.endDate,
      isActive: this.isActive,
      usageLimit: this.usageLimit,
      usedCount: this.usedCount,
      appliesTo: this.appliesTo,
      productsAffected: this.productsAffected,
      categoriesAffected: this.categoriesAffected,
      couponCode: this.couponCode,
      buyQuantity: this.buyQuantity,
      getQuantity: this.getQuantity,
      getDiscountPercentage: this.getDiscountPercentage,
      usersAllowed: this.usersAllowed,
      maxUsesPerUser: this.maxUsesPerUser,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
module.exports = Offer;