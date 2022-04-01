const socket = io(),
    messages = document.querySelector('.messages'),
    form = document.querySelector('.form'),
    input = document.querySelector('.input')

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
        socket.emit('chat message', {path: window.location.pathname, login: login, name: Name, date: date, time: time, message: input.value})
        input.value = ''
    };
});

socket.on('chat message', (data) => {
    const item = document.createElement('li')
    if (login === data.login) {
        item.innerHTML = `<div class='yourBlock'><div class="message"><div class="yourName">Вы:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    else if (data.login === "Admin") {
        item.innerHTML = `<div class='block'><div class="message"><div class="admin">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    else {
        item.innerHTML = `<div class='block'><div class="message"><div class="name">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
})

