const LightDB = require('../data/LightDB') 
let database = require('../data/database.json')
let chats = require('../data/chats.json')
const User = LightDB.User

// GET /about
exports.sendAboutPage = (req, res) => {
    res.render('about', {
        count: LightDB.getCount
    })
}

// GET /register
exports.sendRegisterPage = (req, res) => {
    res.render('login', {
        pageName: 'Register',
        action: 'register',
        name: true,
        repeat: true,
        buttonValue: 'зарегистрироваться',
        href1: '/about',
        href2: '/login',
        button1: 'на главную',
        button2: 'войти',
    })
}

// POST register
exports.registration = (req, res) => { // add new user to database
    // check if all fields are filled
    if (req.body.login && req.body.name && req.body.password && req.body.repeat) {
        const newLogin = req.body.login
        const newName = req.body.name
        const newPassword = req.body.password
        // user presence check
        if(LightDB.findUser(newLogin) === false) {
            // if not add new user
            if (req.body.password === req.body.repeat) {
                const newUser = new User(newLogin, newName, newPassword, "User")
                // save the user
                if (newUser.save() === true) {
                    // save login and name in cookies
                    res.cookie("login", newLogin, {'maxAge': 5000000000})
                    res.cookie("name", newName, {'maxAge': 5000000000})
                    res.redirect('/chats')
                }
                //if the user not saved
                else {
                    res.render('login', {
                        pagename: 'Register',
                        action: 'register',
                        name: true,
                        repeat: true,
                        errorMessage: 'ошибка регистрации',
                        buttonValue: 'зарегистрироваться',
                        href1: '/about',
                        href2: '/login',
                        button1: 'на главную',
                        button2: 'войти',
                    })
                }
            }
            // if passwords don't match
            else {
                res.render('login', {
                    pagename: 'Register',
                    action: 'register',
                    name: true,
                    repeat: true,
                    errorMessage: 'пароли не совпадают',
                    buttonValue: 'зарегистрироваться',
                    href1: '/about',
                    href2: '/login',
                    button1: 'на главную',
                    button2: 'войти',
                })
            }
        } 
        // if login matched
        else {
            res.render('login', {
                pagename: 'Register',
                action: 'register',
                name: true,
                repeat: true,
                errorMessage: 'этот логин занят',
                buttonValue: 'зарегистрироваться',
                href1: '/about',
                href2: '/login',
                button1: 'на главную',
                button2: 'войти',
            });
        };
    }
    // if not all fields are filled
    else {
        res.render('login', {
            pagename: 'Register',
            action: 'register',
            name: true,
            repeat: true,
            errorMessage: 'не все поля заполнены',
            buttonValue: 'зарегистрироваться',
            href1: '/about',
            href2: '/login',
            button1: 'на главную',
            button2: 'войти',
        });
    };
};

// GET /login
exports.sendLoginPage = (req, res) => {
    res.render('login', {
        pageName: 'login',
        action: 'login',
        buttonValue: 'войти',
        href1: '/about',
        href2: '/register',
        button1: 'на главную',
        button2: 'регитстрация',
    });
};

// POST /login
exports.login = (req, res) => {
    // check if all fields are filled
    if (req.body.login && req.body.password) {
        const newLogin = req.body.login
        const newPassword = req.body.password
        // user presence check
        // if the user doesn't exist
        if(LightDB.findUser(newLogin) === false) {
            res.render('login', {
                pageName: 'login',
                action: 'login',
                errorMessage: 'пользователь не найден',
                buttonValue: 'войти',
                href1: '/about',
                href2: '/register',
                button1: 'на главную',
                button2: 'регитстрация',
            })
        } 
        // if the user exists
        else {
            // check passwords
            if (LightDB.checkPassword(newLogin, newPassword) === true) {
                // update cookies
                res.cookie("login", newLogin, {'maxAge': 5000000000})
                res.cookie("name", LightDB.getName(newLogin), {'maxAge': 5000000000})
                res.redirect('/chats')
            }
            // if password doesn't match
            else {
                res.render('login', {
                    pageName: 'login',
                    action: 'login',
                    errorMessage: 'неверный пароль',
                    buttonValue: 'войти',
                    href1: '/about',
                    href2: '/register',
                    button1: 'на главную',
                    button2: 'регитстрация',
                })
            } 
        }
    }
    // if not all fields are filled
    else {
        res.render('login', {
            pageName: 'login',
            action: 'login',
            errorMessage: 'не все поля заполнены',
            buttonValue: 'войти',
            href1: '/about',
            href2: '/register',
            button1: 'на главную',
            button2: 'регитстрация',
        })
    }
}

// GET /chats
exports.sendChatsPage = (req, res) => {
    // checking for cookies
    if(req.cookies.login != null) {
         res.render('chats')
    }
    // if cookies don't exist
    else {
        res.redirect('/login')
    }
}

// POST //chats
exports.chats = (req, res) => {
    res.json(chats)
}

// GET /chat/:chatName
exports.sendChatPage = (req, res) => {
    // checking for cookies
    if (req.cookies.login != null) {
        // find chat in database
        // if chat public
        if (chats[req.params["chatName"]] != undefined) {
            // check type of chat
            if(chats[req.params["chatName"]].type != "private" && req.cookies.login === chats[req.params["chatName"]].author) {
                res.render('chat', {
                    name: chats[req.params["chatName"]].name,
                    author: true,
                    public: true,
                    js: "/js/publicChat.js"
                })
            }
            else if(chats[req.params["chatName"]].type != "private") {
                res.render('chat', {
                    name: chats[req.params["chatName"]].name,
                    public: true,
                    js: "/js/publicChat.js"
                })
            }
            // if chat is private and user is author
            else if (chats[req.params["chatName"]].type === "private" && req.cookies.login === chats[req.params["chatName"]].author) {
                res.render('chat', {
                    name: chats[req.params["chatName"]].name,
                    author: true,
                    public: true,
                    js: "/js/publicChat.js"
                })
            }
            // if chat is private
            else if (chats[req.params["chatName"]].type === "private") {
                res.render('chat', {
                    name: chats[req.params["chatName"]].name,
                    js: "/js/privateChat.js"
                })
            }
        }
        // if chat doesn't exist
        else {
            res.redirect('/chats')
        }
    }
    // if user isn't log in
    else {
        res.redirect('/about')
    }
}

// GET unregistered chat page
exports.chatRedirect = (req, res) => {
    res.redirect('/chats')
}

// GET /login if user isn't logged in
exports.loginRedirect = (req, res) => {
    // checking for cookies
    if(req.cookies.login != null) {
        res.redirect('/chats')
    }
    else {
        res.redirect('/login')
    }
}

// GET /create
exports.sendCreatePage = (req, res) => {
    // checking for cookies
    if(req.cookies.login != null) {
        res.render('create')
    }
    else {
        res.redirect('/login')
    }
}

// POSt /create
exports.create = (req, res) => {
    // check if all fields are filled
    if (req.body.name && req.body.radio && req.body.color) {
        const name = req.body.name
        const radio = req.body.radio
        const color = req.body.color
        const path = LightDB.path()

        // if chat with this login doesn't exist
        if (LightDB.findChat(path) === false) {
            if (LightDB.saveChat(path, radio, name, req.cookies.login, color) === true) {
                res.redirect(`/chats/${path}`)
            }
        }
        // if exist
        else {
            res.render('create', {
                message: "такой чат уже существует"
            }); 
        }
    }
    // if not all fields are filled
    else {
        res.render('create', {
            message: "не все поля заполнены"
        });
    };
}

// GET /admin
exports.sendAdminPage = (req, res) => {
    // cheking for cookies and user permissions
    if (req.cookies.login != null && database[1][req.cookies.login].role === 'Admin')
    {
        res.render('admin') 
    }
    else {
        res.redirect('/about')
    }
}

// POST  /admin
exports.admin = (req, res) => {
    res.json(database[1])
}

// GET unregistered page
exports.error404 = (req, res) => {
    res.render('404')
}