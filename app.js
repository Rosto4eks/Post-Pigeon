const express = require('express'),
    server = express(),
    router = require('./routes/router'),
    http = require('http').createServer(server),
    cookieParser = require('cookie-parser'),
    io = require('socket.io')(http),
    expressHbs = require('express-handlebars'),
    hbs = require('hbs')

module.exports = io
const sockets = require('./routes/sockets')

server.use(express.static(__dirname + '/public'))
server.set('view engine', 'hbs')
server.use(cookieParser('Rosto4eks Limited'))
server.use('/', router)

io.on('connection', sockets)

const PORT = 1337;

http.listen(PORT, () => {
    console.log(`\nlocal adress:   localhost:${PORT}\nnetwork adress: 192.168.100.6:${PORT}`);
})
