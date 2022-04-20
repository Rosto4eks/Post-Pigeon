const avatar = document.querySelector('.avatar__image'),
      load = document.querySelector('.load__image'),
      label = document.querySelector('.load')

load.addEventListener('input', event => {
    label.style.backgroundColor = '#275a49'
    let reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = () => {
        avatar.src = reader.result
    }
})