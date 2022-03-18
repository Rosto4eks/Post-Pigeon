const socket = io()
const messages = document.querySelector('.messages')
const form = document.querySelector('.form')
const input = document.querySelector('.input')

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}
 
Name = getCookie("name")
login = getCookie("login")

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value) {
        socket.emit('chat message', {login: login, name: Name + ':&nbsp', message: input.value})
        input.value = ''
    };
});

socket.on('chat message', (data) => {
    const item = document.createElement('li')
    const fulldate = new Date()
    const date = fulldate.toLocaleDateString()
    let hours = fulldate.getHours()
    if (hours < 10) {hours = `0${hours}`}
    let minutes = fulldate.getMinutes()
    if (minutes < 10) {minutes = `0${minutes}`}
    const time = hours + ':' + minutes
    if (login === data.login) {
        item.innerHTML = `<div class='yourBlock'><div class="message"><div class="yourName">Вы:&nbsp</div>${data.message}<div class='time'>${date}, ${time}</div></div></div>`;
    }
    else {
        item.innerHTML = `<div class='block'><div class="message"><div class="name">${data.name}</div>${data.message}<div class='time'>${date}, ${time}</div></div></div>`;
    }
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
});