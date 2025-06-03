class Product{
    constructor({name, description,price,stock,category,imageUrl}){
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imageUrl = imageUrl;
    }

}

module.exports = Product;