const {default : fs} = await import ('fs');
const {default : Producto} = await import ('../dominio/Producto.js');


export default class ManagerProductos{

    /**
     * SERVICIOS DE PRODUCTOS
     * @returns
     */

    static obtenerInventarioTotal(){
       let productoArray = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));
       return JSON.stringify(productoArray);
    }

    static obtenerInventario(limit){
       let productoArray = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));
       return JSON.stringify(productoArray.slice(0, Number(limit)));
    }

    static buscarProductoPorId(id){
       let productoArray = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));
       return productoArray.filter(x => x.id === id);
    }

    static agregarProducto(title, description, code, price, stock, category){
        let productoArray = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));

        let idNext = (productoArray.reduce((a,x) => ((a < x.id)? (a=x.id) : (a)), 0)) + 1;

        let producto = new Producto(idNext, title, description, code, price, stock, category);

        productoArray.push(producto);

        fs.writeFileSync('./productos.json', JSON.stringify(productoArray, null, 3));

        console.log("SE AGREGO UN NUEVO PRODUCTO CON ID: "+ idNext);
    }

    static modificarProducto(id, title, description, code, price, status, stock, category){
        let productoArray = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));

        let producto = productoArray.filter(x => x.id === id)[0];

        if(title !== null){
            producto.title = title;
        }

        if(description !== null){
            producto.description = description;
        }

        if(code !== null){
            producto.code = code;
        }

        if(precio !== null){
            producto.price = price;
        }

        if(status !== null){
            producto.status = status;
        }

        if(stock !== null){
            producto.stock = stock;
        }

        if(category !== null){
            producto.category = category;
        }

        productoArray.map(function(p){
            if(p.id == producto.id){
              p = producto;
            }
        });

        fs.writeFileSync('./productos.json', JSON.stringify(productoArray, null, 3));

        console.log("SE MODIFICO PRODUCTO CON ID: "+ producto.id);
    }

    static borrarProducto(id){
        let productoArray = JSON.parse(fs.readFileSync('./productos.json', 'utf-8'));

        productoArray = productoArray.filter((x) => (x.id !== id));

        fs.writeFileSync('./productos.json', JSON.stringify(productoArray, null, 3));

        console.log("SE BORRO UN PRODUCTO CON ID: "+ id);
    }
}
