const express = require('express'),
      urlencodedParser = express.urlencoded({extended: false}),
      controller = require('../controllers/controller'),
      router = express.Router(),
      multer = require('multer'),
      upload = multer({dest:"public/avatars"})


router.get('/', controller.chatRedirect)

router.get('/about', controller.getAbout)

router.get('/register', controller.getRegister)

router.post('/register', urlencodedParser, controller.postRegister)

router.get('/login', controller.getLogin)

router.post('/login', urlencodedParser, controller.postLogin)

router.get('/chats', controller.getChats)

router.post('/chats', urlencodedParser, controller.postChats)

router.get('/chats/:chatName', controller.getChat)

router.get('/profile/:login', controller.getProfile)

router.post('/profile', upload.single("file"), controller.postProfile)

router.get('/create', controller.getCreate)

router.post('/create', urlencodedParser, upload.single("file"), controller.postCreate)

router.get('/admin', controller.getAdmin)

router.post('/admin', urlencodedParser, controller.postAdmin)

router.get('*', controller.error404)

module.exports = router