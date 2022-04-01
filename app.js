const express = require('express'),
    server = express(),
    router = require('./routes/router'),
    http = require('http').createServer(server),
    cookieParser = require('cookie-parser'),
    io = require('socket.io')(http),
    expressHbs = require('express-handlebars'),
    hbs = require('hbs'),
    fs = require('fs')

server.use(express.static(__dirname + '/public'))
server.set('view engine', 'hbs')
server.use(cookieParser('Rosto4eks Limited'))
server.use('/', router)

// connecting socket 
io.on('connection', (socket) => {
    // send all messages from database
    socket.on('join', (data) => {
        fs.readFile(`./data${data}.json`, (error,  MessagesData) => {
            if (error === null) {
                socket.join(data)
                MessagesData = JSON.parse(MessagesData)
                for (elem in MessagesData[1]) {
                    socket.emit('chat message', {login: MessagesData[1][elem]["login"], name: MessagesData[1][elem]["name"], date: MessagesData[1][elem]["date"], time:MessagesData[1][elem]["time"] ,message: MessagesData[1][elem]["message"]});
                }
            }
            else {
                socket.emit('redirect', '/chats');
            }
        })
    })

    socket.on('chat message', (data) => {
        let MessagesData = require(`./data${data.path}.json`)
        let id = MessagesData[0].nextID
        MessagesData[1][id] = {"login": data.login,"name": data.name, "date": data.date, "time": data.time ,"message": data.message}
        MessagesData[0]["nextID"]++
        // sasving message in databse
        fs.writeFile(`data${data.path}.json`, JSON.stringify(MessagesData, null, 2), ()=>{})
        // sending message
        io.to(data.path).emit('chat message', {login: data.login, name: data.name, date: data.date, time: data.time ,message: data.message});
    })
})

const PORT = 1337;

http.listen(PORT, () => {
    console.log(`\nlocal adress:   localhost:${PORT}\nnetwork adress: 192.168.100.6:${PORT}`);
})
