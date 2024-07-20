export default class Cart{
    constructor(id){
        this.id = id;
        this.products = [];
    }

    get id() {
        return this.id
    }
}
