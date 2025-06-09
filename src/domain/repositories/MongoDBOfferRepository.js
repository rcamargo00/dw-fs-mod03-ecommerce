const mongoose = require('mongoose');
const IOfferRepository = require('./OfferRepository');
const Offer = require('../domain/entities/Offer');

// Definición del esquema de Mongoose para la oferta
const OfferSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Usamos String para que coincida con la entidad 'id'
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixedAmount', 'freeShipping', 'buyOneGetOne', 'couponCode']
  },
  value: { type: Number, required: true, min: 0 },
  minimumPurchaseAmount: { type: Number, default: 0, min: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: null, min: 0 }, // null para ilimitado
  usedCount: { type: Number, default: 0, min: 0 },
  appliesTo: {
    type: String,
    default: 'allProducts',
    enum: ['allProducts', 'specificProducts', 'specificCategories']
  },
  productsAffected: [{ type: String }], // Array de IDs de productos (String)
  categoriesAffected: [{ type: String }], // Array de IDs de categorías (String)
  couponCode: { type: String, unique: true, sparse: true, default: null }, // unique: true para códigos, sparse: true permite null
  buyQuantity: { type: Number, default: null, min: 1 },
  getQuantity: { type: Number, default: null, min: 0 },
  getDiscountPercentage: { type: Number, default: null, min: 0, max: 100 },
  usersAllowed: [{ type: String }], // Array de IDs de usuario (String)
  maxUsesPerUser: { type: Number, default: null, min: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  // Opciones del esquema
  _id: false,
  timestamps: false, // Deshabilita los timestamps automáticos de Mongoose, los manejamos manualmente
});

// Crear el modelo de Mongoose
const OfferModel = mongoose.model('Offer', OfferSchema);

/*
 * @class MongoDBOfferRepository
 * @implements {IOfferRepository}
 * @description Implementación concreta del repositorio de ofertas usando MongoDB (Mongoose).
 */
class MongoDBOfferRepository extends IOfferRepository {
  constructor() {
    super();
  }

  /*
   * Mapea un documento de Mongoose a una entidad de dominio Offer.
   * @param {Object} doc - Documento de Mongoose.
   * @returns {Offer} Entidad Offer.
   */
  _toEntity(doc) {
    if (!doc) return null;
    return new Offer({
      id: doc._id,
      name: doc.name,
      type: doc.type,
      value: doc.value,
      minimumPurchaseAmount: doc.minimumPurchaseAmount,
      startDate: doc.startDate,
      endDate: doc.endDate,
      isActive: doc.isActive,
      usageLimit: doc.usageLimit,
      usedCount: doc.usedCount,
      appliesTo: doc.appliesTo,
      productsAffected: doc.productsAffected,
      categoriesAffected: doc.categoriesAffected,
      couponCode: doc.couponCode,
      buyQuantity: doc.buyQuantity,
      getQuantity: doc.getQuantity,
      getDiscountPercentage: doc.getDiscountPercentage,
      usersAllowed: doc.usersAllowed,
      maxUsesPerUser: doc.maxUsesPerUser,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /*
   * Encuentra una oferta por su ID.
   * Corresponde a una operación GET para un recurso específico.
   * @param {string} offerId - El ID de la oferta.
   * @returns {Promise<Offer | null>} La oferta o null si no se encuentra.
   */
  async findById(offerId) {
    try {
      const doc = await OfferModel.findById(offerId).lean();
      return this._toEntity(doc);
    } catch (error) {
      console.error('Error finding offer by ID:', error);
      throw error;
    }
  }

  /*
   * Encuentra todas las ofertas activas.
   * Corresponde a una operación GET para una colección de recursos.
   * @returns {Promise<Array<Offer>>} Una lista de ofertas activas.
   */
  async findActiveOffers() {
    try {
      const now = new Date();
      const docs = await OfferModel.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        // Considerar usageLimit si se quiere filtrar aquí, o manejarlo en la lógica de negocio
        // usageLimit: { $or: [{ $eq: null }, { $gt: '$usedCount' }] } // Esto es más complejo en find, mejor en la lógica de negocio o agrégation.
      }).lean();
      return docs.map(doc => this._toEntity(doc));
    } catch (error) {
      console.error('Error finding active offers:', error);
      throw error;
    }
  }

  /*
   * Guarda una nueva oferta.
   * Corresponde a una operación POST para crear un nuevo recurso.
   * @param {Offer} offer - La entidad de la oferta a guardar.
   * @returns {Promise<Offer>} La oferta guardada.
   */
  async save(offer) {
    try {
      const docData = offer.toObject();
      docData._id = docData.id; // Mapear id de entidad a _id de Mongoose
      delete docData.id; // Eliminar la propiedad id duplicada
      const newDoc = new OfferModel(docData);
      const savedDoc = await newDoc.save();
      return this._toEntity(savedDoc.toObject());
    } catch (error) {
      console.error('Error saving new offer:', error);
      throw error;
    }
  }

  /*
   * Actualiza una oferta existente.
   * Corresponde a una operación PUT/PATCH para actualizar un recurso existente.
   * En el contexto de "POST" para modificar, también se aplica.
   * @param {Offer} offer - La entidad de la oferta a actualizar.
   * @returns {Promise<Offer>} La oferta actualizada.
   */
  async update(offer) {
    try {
      const docData = offer.toObject();
      docData._id = docData.id; // Asegurar que _id esté presente para la búsqueda
      delete docData.id; // Eliminar la propiedad id duplicada
      docData.updatedAt = new Date(); // Actualizar el timestamp

      const updatedDoc = await OfferModel.findByIdAndUpdate(
        docData._id,
        { $set: docData },
        { new: true, runValidators: true }
      ).lean();
      if (!updatedDoc) {
        throw new Error(`Offer with ID ${docData._id} not found for update.`);
      }
      return this._toEntity(updatedDoc);
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  }

  /*
   * Elimina una oferta por su ID.
   * @param {string} offerId - El ID de la oferta a eliminar.
   * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
   */
  async delete(offerId) {
    try {
      const result = await OfferModel.deleteOne({ _id: offerId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }
}

module.exports = MongoDBOfferRepository;