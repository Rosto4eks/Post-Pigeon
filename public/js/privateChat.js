const socket = io(),
    messages = document.querySelector('.messages')

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



socket.on('chat message', (data) => {
    const item = document.createElement('li')
    if (login === data.login) {
        item.innerHTML = `<div class='yourBlock'><div class="message" id=${data.id}><div class="yourName">Вы:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    else if (data.login === "Admin") {
        item.innerHTML = `<div class='block'><div class="message" id=${data.id}><div class="admin">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    else {
        item.innerHTML = `<div class='block'><div class="message" id=${data.id}><div class="name">${data.name}:&nbsp</div>${data.message}<div class='time'>${data.date}, ${data.time}</div></div></div>`;
    }
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
})

socket.on('deleteMessage', data => {
    let element = document.getElementById(data.id)
    element.parentElement.style.display = 'none'
})
