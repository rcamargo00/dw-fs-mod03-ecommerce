## Documentación de Entidades de E-commerce
Este documento describe las estructuras y funcionalidades de las entidades ShoppingCar (Carrito de Compras) y Offer (Oferta/Descuento) utilizadas en el backend de un sistema de e-commerce.

## Actividad 1

### 1. Entidad ShoppingCar (Carrito de Compras)

La entidad ShoppingCar representa el carrito de compras de un usuario, conteniendo los productos que ha seleccionado para una posible compra. Su diseño busca optimizar el rendimiento al incrustar datos relevantes y permitir una gestión flexible de los ítems.

### Estructura del Objeto

```ts
    class ShoppingCar {
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
        }) { /* ... */ }

        addItem(itemDetails) { /* ... */ }
        removeItem(productId, variant = null) { /* ... */ }
        recalculateTotal() { /* ... */ }
        clearCart() { /* ... */ }
        toObject() { /* ... */ }
    }
```

### Propiedades
```
Propiedad   Tipo    Descripción     Obligatorio     Notas
```

### 2. Entidad Offer (oferta)

La entidad Offer representa una oferta o descuento que puede ser aplicada a productos, categorías o al total de un carrito de compras. Su diseño permite una gran flexibilidad para definir diferentes tipos de promociones y gestionar su validez y uso.

### Estructura del Objeto
```ts
    class Offer {
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
    }) { /* ... */ }

    isValid() { /* ... */ }
    incrementUsage() { /* ... */ }
    toObject() { /* ... */ }
    }
```

### Propiedades
```
    Propiedad     Tipo        Descripción
```


## Actividad 2

Implementación del método Get Post para nosql en la entidades "ShoppingCar" y "Offers"

### ShoppingCar

repositories/MongoDBShoppingCarRepository.js

``` JAVASCRIPT
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

    class MongoDBShoppingCarRepository extends IShoppingCarRepository {
        _toEntity(doc) {}
        async findById(cartId) {}
        async findByUserIdOrSessionId(userId, sessionId) {}
        async save(shoppingCar) {}
        async update(shoppingCar) {}
        async delete(cartId) {}

    }

```


### Offers

repositories/MongoDBOfferRepository.js

```JAVASCRIPT
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

    class MongoDBOfferRepository extends IOfferRepository {
        constructor() {}
        _toEntity(doc) {}
        async findById(offerId) {}
        async findActiveOffers() {}
        async save(offer) {}
        async update(offer) {}
        async delete(offerId) {}
    }
    
    module.exports = MongoDBOfferRepository;
```



