let tableBody = document.querySelector('tbody')
let request = new XMLHttpRequest()
request.open('POST', '/admin', true);
request.setRequestHeader("Content-Type", "application/json");
request.send()
request.addEventListener("load", function () {
     let data = JSON.parse(request.response);
     for (user in data) {
        let newRow = document.createElement("tr");
        let newCell = document.createElement("td");
        newCell.innerHTML = `<td>${user}</td>`

        newRow.appendChild(newCell)
        for (property in data[user]) {
            let newCell = document.createElement("td");
            newCell.innerHTML = `<td>${data[user][property]}</td>` 
            
            newRow.appendChild(newCell)
        }
        tableBody.appendChild(newRow);
     }
});

