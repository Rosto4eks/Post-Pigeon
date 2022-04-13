const socket = io(),
    messages = document.querySelector('.messages'),
    form = document.querySelector('.form'),
    input = document.querySelector('.input'),
    typing = document.querySelector('.typing'),
    menuButton = document.querySelector('.menu__button'),
    menu = document.querySelector('.menu'),
    change__button = document.querySelector('.change__button'),
    delete__button = document.querySelector('.delete__button'),
    file = document.querySelector('.file'),
    fileLabel = document.querySelector('.file__label')

let id = 0,
    last = 0,
    lastItem,
    lastButton,
    inputSwitch = 0

const Name = getCookie("name")
const login = getCookie("login")

socket.on('redirect', (destination) => {
    window.location.href = destination;
})

input.addEventListener('input', event => {
    if (input.value && inputSwitch === 0) {
        socket.emit('typing', {href: window.location.pathname, typing: true, login: login})
        inputSwitch = 1
    }
    if ((input.value).length < 1) {
        inputSwitch = 0
        socket.emit('typing', {href: window.location.pathname, typing: false})
    }
}) 

socket.emit('join', window.location.pathname)
function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (input.value || file.value) {
        const fulldate = new Date()
        const date = fulldate.toLocaleDateString()
        let hours = fulldate.getHours()
        if (hours < 10) {hours = `0${hours}`}
        let minutes = fulldate.getMinutes()
        if (minutes < 10) {minutes = `0${minutes}`}
        const time = hours + ':' + minutes
        if (file.value) {
            socket.emit('chat message', {path: window.location.pathname, login: login, id: id, name: Name, date: date, time: time, message: input.value, file: file.files[0], type: file.value.match(/\.([^.]+)$/)[1]})
        }
        else {
            socket.emit('chat message', {path: window.location.pathname, login: login, id: id, name: Name, date: date, time: time, message: input.value})
        }
       
        input.value = ''
        file.value = ''
        fileLabel.style.transform = 'rotate(0deg)'
        fileLabel.style.borderColor = '#212121'
        inputSwitch = 0
        socket.emit('typing', {href: window.location.pathname, typing: false})
    };
});

socket.on('chat message', (data) => {
    console.log(data)
    const item = document.createElement('li')
    if (login === data.login) {
        if (data.filename) {
            item.innerHTML = `<div class="context"><button class="delete"><img class="trash" src="../images/trash.png"></button></div><div class='yourBlock'><div class="message" id=${data.id}><div class="yourName">Вы:&nbsp</div>${data.message}<img class="upload__image" src='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}'><div class='time'>${data.date}, ${data.time}</div></div></div>`;
        }
        else {
            item.innerHTML = `<div class="context"><button class="delete"><img class="trash" src="../images/trash.png"></button></div><div class='yourBlock'><div class="message" id=${data.id}><div class="yourName">Вы:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
        }
        let deleteButton = item.querySelector('.delete')
        let context = item.querySelector('.context')
        deleteButton.addEventListener('click', event => {
            socket.emit('deleteMessage', {'path': window.location.pathname, 'id': item.lastChild.lastChild.id})
        })
        context.addEventListener('contextmenu', event => {
            event.preventDefault()
            if (last > 0) lastItem.classList.remove('selected'), lastButton.style.display = 'none'
            item.classList.add('selected')
            deleteButton.style.display = 'block'
            lastItem = item
            lastButton = deleteButton
            return lastItem, lastButton, last++
        })
        document.addEventListener('click', event => {
            item.classList.remove('selected')
            deleteButton.style.display = 'none'
        })
    }
    else {
        if (data.filename) {
            item.innerHTML = `<div class="context"><div class='block'><div class="message" id=${data.id}><div class="name">${data.name}:&nbsp</div>${data.message}<img class="upload__image" src='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}'><div class='time'>${data.date}, ${data.time}</div></div></div>`;
        }
        else {
            item.innerHTML = `<div class="context"><div class='block'><div class="message" id=${data.id}><div class="name">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
        }
    }
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
    id = parseInt(data.id) + 1
})

let usersTyping = []
socket.on('typing', data => {
    if (data.typing === true) {
        usersTyping.push(data.login)
        if (usersTyping.length > 1 && usersTyping.length < 3) {
            typing.innerHTML = usersTyping + ' пишут...'
        }
        else if (usersTyping.length > 2) {
            typing.innerHTML = usersTyping.length + ' человека пишут...'
        }
        else {
            typing.innerHTML = usersTyping + ' пишет...'
            typing.style.transform = 'translateY(-55px)'
        }
    }
    if (data.typing === false && usersTyping.length > 0) {
        usersTyping.pop(data.login)
        if (usersTyping.length > 1 && usersTyping.length < 3) {
            typing.innerHTML = usersTyping + ' пишут...'
        }
        else if (usersTyping.length > 2) {
            typing.innerHTML = usersTyping.length + ' человека пишут...'
        }
        else {
            typing.innerHTML = usersTyping + ' пишет...'
        }

    }
    if (data.typing === false && usersTyping.length < 1) {
        typing.style.transform = 'translateY(55px)'

    }
})

if (menuButton) {
    let menuSwitch = 0

    menuButton.addEventListener('click', event => {
        if (menuSwitch === 0) {
            menuSwitch = 1
            return menu.style.transform = 'translateY(55px)'
        }
        if (menuSwitch === 1) {
            menuSwitch = 0
            return menu.style.transform = 'translateY(-30px)'
        }
    })
    delete__button.addEventListener('click', event => {
        if (confirm('удалить чат?') === true) {
            socket.emit('deleteChat', {path: window.location.pathname})
        }
    })
    change__button.addEventListener('click', event => {
        alert('скоро появится')
    })
}


socket.on('deleteMessage', data => {
    let element = document.getElementById(data.id)
    element.parentElement.style.display = 'none'
})


file.addEventListener('input', event => {
    fileLabel.style.transform = 'rotate(315deg)'
    fileLabel.style.borderColor = '#9deb9d'
})
