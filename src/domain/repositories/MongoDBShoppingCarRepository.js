const mongoose = require('mongoose');
const IShoppingCarRepository = require('./ShoppingCarRepository');
const ShoppingCar = require('../domain/entities/ShoppingCar');

// Definición del esquema de Mongoose para el carrito de compras
const ShoppingCarItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
  quantity: { type: Number, required: true, min: 1 },
  priceAtAddToCart: { type: Number, required: true, min: 0 },
  variant: { type: mongoose.Schema.Types.Mixed, default: null }, // Usamos Mixed para flexibilidad
});

const ShoppingCarSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Usamos String para que coincida con la entidad 'id'
  userId: { type: String, index: true, sparse: true }, // Indexamos para búsquedas rápidas, sparse para carritos de invitados
  sessionId: { type: String, index: true, sparse: true }, // Indexamos para búsquedas rápidas, sparse para carritos de usuarios
  items: [ShoppingCarItemSchema],
  totalAmount: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  appliedCoupon: {
    couponCode: { type: String, required: false },
    discountAmount: { type: Number, required: false },
  },
  status: { type: String, default: 'active', enum: ['active', 'abandoned', 'converted'] },
}, {
  // Opciones del esquema: deshabilita el ID por defecto de Mongoose ya que usamos _id personalizado
  _id: false,
  timestamps: false, // Deshabilita los timestamps automáticos de Mongoose, los manejamos manualmente
});

// Crear el modelo de Mongoose
const ShoppingCarModel = mongoose.model('ShoppingCar', ShoppingCarSchema);

/*
 * @class MongoDBShoppingCarRepository
 * @implements {IShoppingCarRepository}
 * @description Implementación concreta del repositorio de carritos de compras usando MongoDB (Mongoose).
 */
class MongoDBShoppingCarRepository extends IShoppingCarRepository {
  constructor() {
    super();
  }

  /*
   * Mapea un documento de Mongoose a una entidad de dominio ShoppingCar.
   * @param {Object} doc - Documento de Mongoose.
   * @returns {ShoppingCar} Entidad ShoppingCar.
   */
  _toEntity(doc) {
    if (!doc) return null;
    return new ShoppingCar({
      id: doc._id,
      userId: doc.userId,
      items: doc.items.map(item => ({
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        priceAtAddToCart: item.priceAtAddToCart,
        variant: item.variant || null,
      })),
      totalAmount: doc.totalAmount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      sessionId: doc.sessionId,
      appliedCoupon: doc.appliedCoupon || null,
      status: doc.status,
    });
  }

  /*
   * Encuentra un carrito de compras por su ID.
   * Corresponde a una operación GET para un recurso específico.
   * @param {string} cartId - El ID del carrito.
   * @returns {Promise<ShoppingCar | null>} El carrito de compras o null si no se encuentra.
   */
  async findById(cartId) {
    try {
      const doc = await ShoppingCarModel.findById(cartId).lean(); // .lean() para obtener un objeto JS plano
      return this._toEntity(doc);
    } catch (error) {
      console.error('Error finding shopping cart by ID:', error);
      throw error;
    }
  }

  /*
   * Encuentra un carrito de compras por ID de usuario o ID de sesión.
   * Corresponde a una operación GET para un recurso específico.
   * @param {string} userId - El ID del usuario.
   * @param {string} [sessionId] - El ID de la sesión (para carritos de invitados).
   * @returns {Promise<ShoppingCar | null>} El carrito de compras o null si no se encuentra.
   */
  async findByUserIdOrSessionId(userId, sessionId) {
    try {
      let query = {};
      if (userId) {
        query.userId = userId;
      } else if (sessionId) {
        query.sessionId = sessionId;
      } else {
        return null; // No hay ID de usuario ni de sesión
      }

      const doc = await ShoppingCarModel.findOne(query).lean();
      return this._toEntity(doc);
    } catch (error) {
      console.error('Error finding shopping cart by user ID or session ID:', error);
      throw error;
    }
  }

  /*
   * Guarda un nuevo carrito de compras.
   * Corresponde a una operación POST para crear un nuevo recurso.
   * @param {ShoppingCar} shoppingCar - La entidad del carrito de compras a guardar.
   * @returns {Promise<ShoppingCar>} El carrito de compras guardado.
   */
  async save(shoppingCar) {
    try {
      const docData = shoppingCar.toObject();
      docData._id = docData.id; // Mapear id de entidad a _id de Mongoose
      delete docData.id; // Eliminar la propiedad id duplicada
      const newDoc = new ShoppingCarModel(docData);
      const savedDoc = await newDoc.save();
      return this._toEntity(savedDoc.toObject());
    } catch (error) {
      console.error('Error saving new shopping cart:', error);
      throw error;
    }
  }

  /*
   * Actualiza un carrito de compras existente.
   * Corresponde a una operación PUT/PATCH para actualizar un recurso existente.
   * En el contexto de "POST" para modificar, también se aplica.
   * @param {ShoppingCar} shoppingCar - La entidad del carrito de compras a actualizar.
   * @returns {Promise<ShoppingCar>} El carrito de compras actualizado.
   */
  async update(shoppingCar) {
    try {
      const docData = shoppingCar.toObject();
      docData._id = docData.id; // Asegurar que _id esté presente para la búsqueda
      delete docData.id; // Eliminar la propiedad id duplicada
      docData.updatedAt = new Date(); // Actualizar el timestamp

      // findByIdAndUpdate requiere que el _id sea el primer argumento
      const updatedDoc = await ShoppingCarModel.findByIdAndUpdate(
        docData._id,
        { $set: docData }, // Usamos $set para actualizar las propiedades, no sobrescribir el documento entero
        { new: true, runValidators: true } // new: true devuelve el documento actualizado, runValidators: true ejecuta las validaciones del esquema
      ).lean();
      if (!updatedDoc) {
        throw new Error(`Shopping cart with ID ${docData._id} not found for update.`);
      }
      return this._toEntity(updatedDoc);
    } catch (error) {
      console.error('Error updating shopping cart:', error);
      throw error;
    }
  }

  /*
   * Elimina un carrito de compras por su ID.
   * @param {string} cartId - El ID del carrito a eliminar.
   * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
   */
  async delete(cartId) {
    try {
      const result = await ShoppingCarModel.deleteOne({ _id: cartId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting shopping cart:', error);
      throw error;
    }
  }
}

module.exports = MongoDBShoppingCarRepository;