const socket = io(),
    messages = document.querySelector('.messages'),
    scroller = document.querySelector('.scroller'),
    point = document.querySelector('.point')

let id = 0,
    pointValue = 0

const Name = getCookie("name")
const login = getCookie("login")


socket.emit('join', window.location.pathname)


socket.on('redirect', (destination) => {
    window.location.href = destination;
})


socket.on('chat message', (data) => {
    const item = document.createElement('li')
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
    messages.appendChild(item)
    if (messages.scrollHeight <= 1500 || messages.scrollTop >= messages.scrollHeight - 1000) {
        messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth"
        });
    }
    else if (data.join != 'join') {
        pointValue++
        if (pointValue >= 1) {
            point.style.display = 'block'
            point.innerHTML = pointValue
        }
    }
    if (data.join === 'join') {
        messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth"
        }); 
    }
    id = parseInt(data.id) + 1
})

socket.on('deleteMessage', data => {
    let element = document.getElementById(data.id)
    element.parentElement.style.display = 'none'
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


function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
	return matches ? decodeURIComponent(matches[1]) : undefined
}