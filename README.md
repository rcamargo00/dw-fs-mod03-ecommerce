## Documentación de Entidades de E-commerce
Este documento describe las estructuras y funcionalidades de las entidades ShoppingCar (Carrito de Compras) y Offer (Oferta/Descuento) utilizadas en el backend de un sistema de e-commerce.

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