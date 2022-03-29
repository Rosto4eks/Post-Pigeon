const express = require('express'),
    server = express(),
    router = require('./routes/router'),
    http = require('http').createServer(server),
    cookieParser = require('cookie-parser'),
    io = require('socket.io')(http),
    expressHbs = require('express-handlebars'),
    hbs = require('hbs'),
    fs = require('fs'),
    MessagesData = require('./data/data.json')

server.use(express.static(__dirname + '/public'))
server.set('view engine', 'hbs')
server.use(cookieParser('Rosto4eks Limited'))
server.use('/', router)

// connecting socket to chat
io.on('connection', (socket) => {
    for (elem in MessagesData[1]) {
        socket.emit('chat message', {login: MessagesData[1][elem]["login"], name: MessagesData[1][elem]["name"], date: MessagesData[1][elem]["date"], time:MessagesData[1][elem]["time"] ,message: MessagesData[1][elem]["message"]});
    }

    socket.on('chat message', (data) => {
        let id = MessagesData[0].nextID
        MessagesData[1][id] = {"login": data.login,"name": data.name, "date": data.date, "time": data.time ,"message": data.message}
        MessagesData[0]["nextID"]++
        fs.writeFile('data/data.json', JSON.stringify(MessagesData, null, 2), ()=>{})
        io.emit('chat message', {login: data.login, name: data.name, date: data.date, time: data.time ,message: data.message});
    })
})

const PORT = 1337;

http.listen(PORT, () => {
    console.log(`\nlocal adress:   localhost:${PORT}\nnetwork adress: 192.168.100.6:${PORT}`);
})
