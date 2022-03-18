const express = require('express'),
    server = express(),
    router = require('./routes/router'),
    http = require('http').createServer(server),
    cookieParser = require('cookie-parser'),
    io = require('socket.io')(http),
    expressHbs = require('express-handlebars'),
    hbs = require('hbs')

server.use(express.static(__dirname + '/public'));
server.set('view engine', 'hbs');
server.use(cookieParser('Rosto4eks Limited'))
server.use('/', router);

// connecting socket to chat
io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', {name: data.name, message: data.message});
    });
});

const PORT = 1337;

http.listen(PORT, () => {
    console.log(`\nlocal adress:   localhost:${PORT}\nnetwork adress: 192.168.100.6:${PORT}`);
});
