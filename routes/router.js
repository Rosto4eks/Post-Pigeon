const express = require('express')
const jsonParser = express.json()
const urlencodedParser = express.urlencoded({extended: false})
const controller = require('../controllers/controller')
const router = express.Router()

router.get('/', controller.chatRedirect)

router.get('/about', controller.getAbout)

router.get('/register', controller.getRegister)

router.post('/register', urlencodedParser, controller.postRegister)

router.get('/login', controller.getLogin)

router.post('/login', urlencodedParser, controller.postLogin)

router.get('/chats', controller.getChats)

router.post('/chats', jsonParser, controller.postChats)

router.get('/chats/:chatName', controller.getChat)

router.get('/create', controller.getCreate)

router.post('/create', urlencodedParser, controller.postCreate)

router.get('/admin', controller.getAdmin)

router.post('/admin', jsonParser, controller.postAdmin)

router.get('*', controller.error404)

module.exports = router