const socket = io()

document.getElementById('idAgregarProd').addEventListener('click', function() {
    let optionCar = document.getElementById('item-select-car').value;
    let optionProd = document.getElementById('item-select-product').value;

    if(optionCar === "null"){
        alert("Debe seleccionar un carrito al cual agregar este producto");
        return;
    }

    if(optionProd === "null"){
        alert("Debe seleccionar un producto");
        return;
    }
    
    console.log("EMITIENDO PETICION A SERVIDOR POR WEBSOCKET: Actualizar carrito con un producto")
    socket.emit('messageSERVER', {idCarrito: optionCar, idProducto: optionProd});
});

socket.on("messageCLIENT", data => {
    console.log('RESPUESTA DEL SERVIDOR POR WEBSOCKET: '+ data);
    actualizarTablaDeProductos(document.getElementById('item-select-car').value)
})



function quitarProductoCarrito(idProduct){
    let optionCar = document.getElementById('item-select-car').value;

    console.log("EMITIENDO PETICION A SERVIDOR POR WEBSOCKET: Quitar producto de carrito")
    socket.emit('messageQuitarProductSERVER', {idCarrito: optionCar, idProducto: idProduct});
}

socket.on("messageQuitarProductCLIENT", data => {
    console.log('RESPUESTA DEL SERVIDOR POR WEBSOCKET, QUITAR PRODUCTO: '+ data);
    actualizarTablaDeProductos(document.getElementById('item-select-car').value)
})