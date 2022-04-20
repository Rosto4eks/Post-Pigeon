const chatList = document.querySelector('.chatlist')
let request = new XMLHttpRequest()
request.open('POST', '/chats', true);
request.setRequestHeader("Content-Type", "application/json");
request.send()
request.addEventListener("load", function () {
     let data = JSON.parse(request.response);
     for (chat in data) {
        const item = document.createElement('li')
        item.innerHTML = `<a class="redirect" href=${data[chat].href}><div class="chatAvatar"><img src=../chatAvatars/${chat}.jpg></div><div class="chat__name">${data[chat].name}</div></a>`
        chatList.appendChild(item)
     }
});

