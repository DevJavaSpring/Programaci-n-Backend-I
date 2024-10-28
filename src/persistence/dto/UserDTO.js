export default class UserDTO {
    //proyectados
    first_name;
    last_name;
    age;
    email;
    role;
    cart;
    //no proyectados
    nombreCompleto;

    constructor(user) {
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.age = user.age;
      this.email = user.email;
      this.role = user.role;
      this.cart = user.cart;
      this.nombreCompleto = user.last_name +", "+ user.first_name;
    }

    static getAttributesProjected() {
      return ['first_name', 'last_name', 'age', 'email', 'role', 'cart'];
    }
}


