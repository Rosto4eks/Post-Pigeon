const form = document.querySelector('.image__form'),
     load = document.querySelector('.load__image'),
     logout = document.querySelector('.logout')

load.addEventListener('input', event => {
    form.submit()
})

logout.addEventListener('click', (e) => {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
 })