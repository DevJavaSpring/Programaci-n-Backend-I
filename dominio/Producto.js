export default class Producto{
    constructor(id, title, description, code, price, stock, category){
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = true;
        this.stock = stock;
        this.category = category;    
        this.thumbnails = [];    
    }

    get id() {
        return this.id
    }
    
    get title() {
        return this.title
    }

    set title(title) {
        this.title = title
    }

    get description() {
        return this.description
    }

    set description(description) {
        this.description = description
    }

    get code() {
        return this.code
    }

    set code(code) {
        this.code = code
    }

    get price() {
        return this.price
    }

    set price(price) {
        this.price = price
    }

    get stock() {
        return this.stock
    }

    set stock(stock) {
        this.stock = stock
    }

    get category() {
        return this.category
    }

    set category(category) {
        this.category = category
    }
}