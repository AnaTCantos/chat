
const express = require('express');
const http = require('http');
const {Server} = require ('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server (server);
app.use(express.static('public'));

var listaUsuarios = {};

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado: ', socket.id);
  listaUsuarios[socket.id] = `Usuario - ${socket.id.substring(0, 4)}`;
  io.emit('update user list' , listaUsuarios);

//Escuchar mensajes públicos del cliente y difundirlos.
  socket.on('chat message', (msg) => {
    console.log ('He recibido el mensaje: ', msg);
    io.emit('chat message', msg);
  
});

//Escuchar mensajes privados del cliente y mandarlos a su receptor.
socket.on('private message', ({destinatario, message})=>{
  console.log("LLEGAN")
  io.to(destinatario).emit('private message', {emisor: listaUsuarios 
  [socket.id], message });
});

socket.on('disconnect', () => {
  console.log('Un cliente se ha desconectado: ', socket.id);
  delete listaUsuarios [socket.id];
  io.emit('update user list' , listaUsuarios);
 
  });
});



const PORT = 3000;
server.listen(PORT, () =>{
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
});

