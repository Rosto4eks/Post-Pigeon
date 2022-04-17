const LightDB = require('../data/LightDB') 
let database = require('../data/database.json')
let chats = require('../data/chats.json')
const User = LightDB.User

exports.getAbout = (req, res) => {
    res.render('about', {
        count: LightDB.getCount
    })
}

exports.getRegister = (req, res) => {
    res.render('login', {
        pageName: 'Register',
        action: 'register',
        register: true,
        buttonValue: 'зарегистрироваться',
        href1: '/about',
        href2: '/login',
        button1: 'на главную',
        button2: 'войти',
    })
}

exports.postRegister = (req, res) => { // add new user to database
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
                        register: true,
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
                    register: true,
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
                register: true,
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
            register: true,
            errorMessage: 'не все поля заполнены',
            buttonValue: 'зарегистрироваться',
            href1: '/about',
            href2: '/login',
            button1: 'на главную',
            button2: 'войти',
        });
    };
};

exports.getLogin = (req, res) => {
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

exports.postLogin = (req, res) => {
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

exports.getChats = (req, res) => {
    // checking for cookies
    if(req.cookies.login != null) {
         res.render('chats')
    }
    // if cookies don't exist
    else {
        res.redirect('/login')
    }
}

exports.postChats = (req, res) => {
    res.json(chats)
}

exports.getChat = (req, res) => {
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

exports.chatRedirect = (req, res) => {
    res.redirect('/chats')
}

exports.loginRedirect = (req, res) => {
    // checking for cookies
    if(req.cookies.login != null) {
        res.redirect('/chats')
    }
    else {
        res.redirect('/login')
    }
}

exports.getCreate = (req, res) => {
    // checking for cookies
    if(req.cookies.login != null) {
        res.render('create')
    }
    else {
        res.redirect('/login')
    }
}

exports.postCreate = (req, res) => {
    // check if all fields are filled
    if (req.body.name && req.body.radio && req.body.color) {
        const name = req.body.name
        const radio = req.body.radio
        const color = req.body.color
        const path = LightDB.path(12, 20)

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

exports.getAdmin = (req, res) => {
    // cheking for cookies and user permissions
    if (req.cookies.login != null && database[1][req.cookies.login].role === 'Admin')
    {
        res.render('admin') 
    }
    else {
        res.redirect('/about')
    }
}

exports.postAdmin = (req, res) => {
    res.json(database[1])
}

exports.error404 = (req, res) => {
    res.render('404')
}