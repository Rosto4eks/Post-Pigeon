const fs = require('fs'),
    io = require('../app'),
    lightDB = require('../data/LightDB')

callback = error => {
    if (error) console.log(error)
}
// connecting socket 
sockets = socket => {
    // send all messages from database
    socket.on('join', data => {
        fs.readFile(__dirname.slice(0, -7) + `/data${data}.json`, (error,  MessagesData) => {
            if (error === null) {
                socket.join(data)
                MessagesData = JSON.parse(MessagesData)
                for (elem in MessagesData) {
                    if (MessagesData[elem]["filename"]) {
                        socket.emit('chat message', {login: MessagesData[elem]["login"], id: elem, name: MessagesData[elem]["name"], date: MessagesData[elem]["date"], time:MessagesData[elem]["time"] ,message: MessagesData[elem]["message"], path: data, filename: MessagesData[elem]["filename"], type: MessagesData[elem]["type"]});
                    }
                    else {
                        socket.emit('chat message', {login: MessagesData[elem]["login"], id: elem, name: MessagesData[elem]["name"], date: MessagesData[elem]["date"], time:MessagesData[elem]["time"] ,message: MessagesData[elem]["message"]});
                    }
                }
            }
            else {
                console.log(error)
                socket.emit('redirect', '/chats');
            }
        })
    })

    // get message and send to all 
    socket.on('chat message', data => {
        let MessagesData = require(`../data${data.path}.json`)
        let id = data.id
        // sending message
        if (data.file) {
            let buff = Buffer.from(data.file)
            let filename = lightDB.path(28, 32)
            MessagesData[id] = {"login": data.login, "name": data.name, "date": data.date, "time": data.time ,"message": data.message, filename: filename, type: data.type}
            fs.writeFile(`./data${data.path}.json`, JSON.stringify(MessagesData, null, 2), callback)
            fs.writeFile(`./public/uploads/${(data.path).slice(7)}/${filename}.${data.type}`, buff, callback)
            io.to(data.path).emit('chat message', {login: data.login, id: data.id, name: data.name, date: data.date, time: data.time ,message: data.message, path: data.path, filename: filename, type: data.type});
        }
        else {
            MessagesData[id] = {"login": data.login, "name": data.name, "date": data.date, "time": data.time ,"message": data.message}
            fs.writeFile(`./data${data.path}.json`, JSON.stringify(MessagesData, null, 2), callback)
            io.to(data.path).emit('chat message', {login: data.login, id: data.id, name: data.name, date: data.date, time: data.time ,message: data.message});
        }
    })

    // delete message from database
    socket.on('deleteMessage', data => {
        let MessagesData = require(`../data${data.path}.json`)
        // delete message
        delete MessagesData[data.id]
        fs.writeFile(`./data${data.path}.json`, JSON.stringify(MessagesData, null, 2), callback)
        io.to(data.path).emit('deleteMessage', {id: data.id})
    })

    socket.on('deleteChat', data => {
        io.to(data.path).emit('redirect', '/chats')
        let chats = require(`../data/chats.json`)
        delete chats[data.path.slice(7)]
        fs.writeFile(`./data/chats.json`, JSON.stringify(chats, null, 2), callback)
        fs.unlink(`./data${data.path}.json`, callback)
        fs.rmSync(`.public/uploads/${data.path.slice(7)}`, { recursive: true, force: true })
    })

    socket.on('typing', data => {
        if (data.typing === true) {
            socket.broadcast.to(data.href).emit('typing', {typing: true, login: data.login})
        }
        else if (data.typing === false) {
            socket.broadcast.to(data.href).emit('typing', {typing: false, login: data.login})
        }
    })

}

module.exports = sockets