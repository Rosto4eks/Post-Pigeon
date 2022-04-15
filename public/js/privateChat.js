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
                                 <div class="message" id=${data.id}>${data.message}</div>
                                 <${filetype} class="uploads" src='../uploads/${data.path.slice(7)}/${data.filename}.${data.type}' controls></${filetype}>
                                 <div class='time'>${data.date}, ${data.time}</div>
                              </div>`
        }
    }
    else {
        item.innerHTML = `<div class='block'>
                             <div class="message" id=${data.id}>${data.message}</div>
                             <div class='time'>${data.date}, ${data.time}</div>
                          </div>`
    }
    messages.appendChild(item)
    messages.scrollTo(0, messages.scrollHeight)
})

socket.on('deleteMessage', data => {
    let element = document.getElementById(data.id)
    element.parentElement.style.display = 'none'
})
