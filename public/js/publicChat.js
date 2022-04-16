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
    fileLabel = document.querySelector('.file__label'),
    scroller = document.querySelector('.scroller'),
    deleteButton = document.querySelector('.delete'),
    point = document.querySelector('.point')

let id = 0,
    inputSwitch = 0,
    lastItem,
    usersTyping = [],
    pointValue = 0

const Name = getCookie("name")
const login = getCookie("login")


socket.emit('join', window.location.pathname)


socket.on('redirect', (destination) => {
    window.location.href = destination;
})


socket.on('chat message', (data) => {
    const item = document.createElement('li')
    if (login === data.login) {
        if (data.filename) {
            if (data.type === 'jpg' || data.type ==='png' || data.type ==='jpeg') {
                filetype = 'img'
            }
            else if (data.type === 'mp4' || data.type === 'avi' || data.type ==='mkv')
            {
                filetype = 'video'
            }
            else {
                filetype = 'a'
            }
            if (filetype === 'a') {
                let size = data.size + ' B' 
                if (data.size === undefined) {
                    size = ''
                }
                if (data.size > 1024) {
                    size = Math.round((data.size / 1024), -2) + ' KB'
                }
                if (data.size > 1048576) {
                    size = Math.round((data.size / 1048576), -2) + ' МB'
                }
                item.innerHTML = `<div class='yourBlock'>
                                     <div class="message" id=${data.id}>${data.message}</div>
                                     <a class="uploads__file" href='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}' download>
                                         <img class="document" src="../images/document.png">
                                         <div class="upload_name">${data.type} ${size}</div>
                                     </a>
                                     <div class='time'>${data.date}, ${data.time}</div>
                                  </div>`
            }
            else {
                item.innerHTML = `<div class='yourBlock'>
                                     <div class="message" id=${data.id}>${data.message}</div>
                                     <${filetype} class="uploads" src='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}' controls></${filetype}>
                                     <div class='time'>${data.date}, ${data.time}</div>
                                  </div>`
            }
        }
        else {
            item.innerHTML = `<div class='yourBlock'>
                                 <div class="message" id=${data.id}>${data.message}</div>
                                 <div class='time'>${data.date}, ${data.time}</div>
                              </div>`
        }
        item.addEventListener('dblclick', event => {
            event.preventDefault()
            return deleteButton.removeAttribute('disabled'), deleteButton.disable = false, deleteButton.style.opacity = 1, item.style.backgroundColor = '#16382d', lastItem = item
  
        })
    }
    else {
        if (data.filename) {
            if (data.type === 'jpg' || data.type ==='png' || data.type ==='jpeg') {
                filetype = 'img'
            }
            else if (data.type === 'mp4' || data.type === 'avi' || data.type ==='mkv')
            {
                filetype = 'video'
            }
            else {
                filetype = 'a'
            }
            if (filetype === 'a') {
                let size = data.size + ' B' 
                if (data.size === undefined) {
                    size = ''
                }
                if (data.size > 1024) {
                    size = Math.round((data.size / 1024), -2) + ' KB'
                }
                if (data.size > 1048576) {
                    size = Math.round((data.size / 1048576), -2) + ' МB'
                }
                item.innerHTML = `<div class='block'>
                                     <div class="name">${data.name}:&nbsp</div>
                                     <div class="message" id=${data.id}>${data.message}</div>
                                     <a class="uploads__file" href='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}' download>
                                         <img class="document" src="../images/document.png">
                                         <div class="upload_name">${data.type} ${size}</div>
                                     </a>
                                     <div class='time'>${data.date}, ${data.time}</div>
                                  </div>`
            }
            else {
                item.innerHTML = `<div class='block'>
                                     <div class="name">${data.name}:&nbsp</div>
                                     <div class="message" id=${data.id}>${data.message}</div>
                                     <${filetype} class="uploads" src='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}' controls></${filetype}>
                                     <div class='time'>${data.date}, ${data.time}</div>
                                  </div>`
            }
        }
        else {
            item.innerHTML = `<div class='block'>
                                 <div class="name">${data.name}:&nbsp</div>
                                 <div class="message" id=${data.id}>${data.message}</div>
                                 <div class='time'>${data.date}, ${data.time}</div>
                              </div>`
        }
    }
    messages.appendChild(item)
    if (login == data.login) {
        messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth"
        }); 
    }
    else if (messages.scrollHeight <= 1500 || messages.scrollTop >= messages.scrollHeight - 1000) {
        messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth"
        });
    }
    else if (login != data.login && data.join != 'join') {
        pointValue++
        if (pointValue >= 1) {
            point.style.display = 'block'
            point.innerHTML = pointValue
        }
    }
    id = parseInt(data.id) + 1
})

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


socket.on('deleteMessage', data => {
    let element = document.getElementById(data.id)
    element.parentElement.style.display = 'none'
})


document.addEventListener('click', event => {
    if (lastItem) {
        lastItem.style.backgroundColor = '#1c4538'
        deleteButton.setAttribute('disabled', true)
        deleteButton.disable = true
        deleteButton.style.opacity = 0
    }
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
            socket.emit('chat message', {path: window.location.pathname, login: login, id: id, name: Name, date: date, time: time, message: input.value, file: file.files[0], type: file.value.match(/\.([^.]+)$/)[1], size: file.files[0].size})
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


file.addEventListener('input', event => {
    fileLabel.style.transform = 'rotate(315deg)'
    fileLabel.style.borderColor = '#216851'
})


messages.addEventListener('scroll', event => {
    if (messages.scrollHeight <= 1500 || messages.scrollTop >= messages.scrollHeight - 1000) {
        scroller.style.opacity = 0
        scroller.setAttribute('disabled', true)
        scroller.disable = true

        point.style.display = 'none'
        point.innerHTML = ''
        pointValue = 0
    }
    else {
        scroller.removeAttribute('disabled')
        scroller.disable = false
        scroller.style.opacity = 1
    }
    
})


scroller.addEventListener('click', event => {
    messages.scrollTo({
        top: messages.scrollHeight,
        behavior: "smooth"
    })
})


deleteButton.addEventListener('click', event => {
    socket.emit('deleteMessage', {path: window.location.pathname, id: lastItem.firstChild.childNodes[1].id})
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

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

setTimeout(() => {
    messages.scrollTo({
        top: messages.scrollHeight,
        behavior: "smooth"
    })    
}, 500);