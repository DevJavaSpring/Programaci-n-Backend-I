const socket = io()
socket.emit('messageCLIENT', "mensaje enviado por CLIENTE");

socket.on("messageSERVER", data => {
    console.log('Mensaje RECIBIDO DESDE SERVIDOR: '+ data);
})