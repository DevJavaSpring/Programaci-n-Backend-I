export default class Carrito{
    constructor(id){
        this.id = id;
        this.products = [];
    }

    get id() {
        return this.id
    }
}
