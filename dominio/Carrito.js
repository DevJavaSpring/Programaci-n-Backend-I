export default class Carrito{
    id;
    products;

    constructor(id){
        this.id = id;
        this.products = [];
    }

    get id() {
        return this.id
    }
}
