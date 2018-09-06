"use strict";
let debug = require('debug')('APP:socket');

// GLOBALS 
let confuser = [];


let io = (socket) =>{

	debug('Sending conection true');
	socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });

}

module.exports = io;

