const socket = io(),
    messages = document.querySelector('.messages'),
    form = document.querySelector('.form'),
    input = document.querySelector('.input')

let id = 0
let i = 0
let lastItem = document.querySelector('.aaa')
let lastButton = document.querySelector('.aaaa')

socket.on('redirect', (destination) => {
    window.location.href = destination;
})

socket.emit('join', window.location.pathname)
function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}
Name = getCookie("name")
login = getCookie("login")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        const fulldate = new Date()
        const date = fulldate.toLocaleDateString()
        let hours = fulldate.getHours()
        if (hours < 10) {hours = `0${hours}`}
        let minutes = fulldate.getMinutes()
        if (minutes < 10) {minutes = `0${minutes}`}
        const time = hours + ':' + minutes
        socket.emit('chat message', {path: window.location.pathname, login: login, id: id, name: Name, date: date, time: time, message: input.value})
        input.value = ''
    };
});

socket.on('chat message', (data) => {
    const item = document.createElement('li')
    if (login === data.login) {
        item.innerHTML = `<button class="delete"><img class="trash" src="../images/trash.png"></button><div class='yourBlock'><div class="message" id=${data.id}><div class="yourName">Вы:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
        let deleteButton = item.querySelector('.delete')
        console.log(deleteButton)
        deleteButton.addEventListener('click', event => {
            console.log(1)
            socket.emit('deleteMessage', {'href': window.location.pathname, 'id': item.lastChild.lastChild.id})
        })
        item.addEventListener('contextmenu', event => {
            event.preventDefault()
            if (i > 0) lastItem.classList.remove('selected'), lastButton.style.display = 'none'
            item.classList.add('selected')
            deleteButton.style.display = 'block'
            lastItem = item
            lastButton = deleteButton
            return lastItem, lastButton, i++
        })
        document.addEventListener('click', event => {
            item.classList.remove('selected')
            deleteButton.style.display = 'none'
        })
    }
    else if (data.login === "Admin") {
        item.innerHTML = `<div class="delete">удалить</div><div class='block'><div class="message" id=${data.id}><div class="admin">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    else {
        item.innerHTML = `<div class="delete">удалить</div><div class='block'><div class="message" id=${data.id}><div class="name">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
    id = parseInt(data.id) + 1
})
document.addEventListener('selectstart', event => {
    event.preventDefault()
})

socket.on('deleteMessage', data => {
    let element = document.getElementById(data.id)
    element.parentElement.style.display = 'none'
})