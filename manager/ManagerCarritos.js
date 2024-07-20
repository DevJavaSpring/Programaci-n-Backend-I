const {default : fs} = await import ('fs');
const {default : Carrito} = await import ('../dominio/Carrito.js');


export default class ManagerCarritos{

    /**
     * SERVICIOS DE CARRITOS
     * @returns
     */

    static obtenerInventario(){
        let carritoString = fs.readFileSync('./carritos.json', 'utf-8');

        let carritoArray = (carritoString === "")? [] : JSON.parse(carritoString);

        return carritoArray;
    }

    static crearNuevoCarrito(){
        let carritoString = fs.readFileSync('./carritos.json', 'utf-8');

        let carritoArray = (carritoString === "")? [] : JSON.parse(carritoString);

        let idNext = (carritoArray.reduce((a,x) => ((a < x.id)? (a=x.id) : (a)), 0)) + 1;

        let carrito = new Carrito(idNext);

        carritoArray.push(carrito);

        fs.writeFileSync('./carritos.json', JSON.stringify(carritoArray, null, 3));

        console.log("SE AGREGO UN NUEVO CARRITO CON ID: "+ idNext);

        return idNext;
    }

    static buscarCarritoPorId(carritoId){
        let carritoString = fs.readFileSync('./carritos.json', 'utf-8');

        let carritoArray = (carritoString === "")? [] : JSON.parse(carritoString);

        return carritoArray.filter(x => x.id === carritoId);
    }


    static actualizarProductosPorCarritoId(carritoId, productos){
        let carritoString = fs.readFileSync('./carritos.json', 'utf-8');

        let carritoArray = (carritoString === "")? [] : JSON.parse(carritoString);


        carritoArray.map(function(c){
            if(c.id == carritoId){
                c.products = productos;
            }
        });

        fs.writeFileSync('./carritos.json', JSON.stringify(carritoArray, null, 3));

        console.log("SE ACTUALIZO LOS PRODUCTOS DEL CARRITO CON ID: "+ carritoId);
    }
}
