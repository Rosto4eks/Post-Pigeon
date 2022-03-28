module.exports = (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', {login: data.login, name: data.name, message: data.message});
    })
}