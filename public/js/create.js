const colorPicker = document.querySelector('.color__picker'),
     color = document.querySelector('.color')

colorPicker.addEventListener('input', event => {
    color.style.backgroundColor = event.target.value
})