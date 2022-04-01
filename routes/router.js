const express = require('express')
const jsonParser = express.json()
const urlencodedParser = express.urlencoded({extended: false})
const controller = require('../controllers/controller')
const router = express.Router()

router.get('/about', controller.sendAboutPage)

router.get('/register', controller.sendRegisterPage)

router.post('/register', urlencodedParser, controller.registration)

router.get('/login', controller.sendLoginPage)

router.post('/login', urlencodedParser, controller.login)

router.get('/chats/:chatName', controller.sendChatPage)

router.get('/admin', controller.sendAdminPage)

router.post('/admin', jsonParser, controller.admin)

router.get('/', controller.chatRedirect)

router.get('*', controller.error404)
module.exports = router