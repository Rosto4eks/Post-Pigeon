const express = require('express')
const jsonParser = express.json()
const urlencodedParser = express.urlencoded({extended: false})
const controller = require('../controllers/controller')
const router = express.Router()

router.get('/register', controller.sendRegisterPage)

router.post('/register', urlencodedParser, controller.registration)

router.get('/login', controller.sendLoginPage)

router.post('/login', urlencodedParser, controller.login)

router.get('/chat', controller.sendChatPage)

router.get('/', controller.loginRedirect)

router.get('*', controller.error404)
module.exports = router