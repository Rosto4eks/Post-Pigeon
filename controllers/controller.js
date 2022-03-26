const LightDB = require('../models/LightDB')
const User = LightDB.User

exports.sendAboutPage = (req, res) => {
    res.render('about', {
        count: LightDB.getCount
    })
}

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

exports.registration = (req, res) => {
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
                if (newUser.save() === true) {
                    res.cookie("login", newLogin, {'maxAge': 5000000000})
                    res.cookie("name", newName, {'maxAge': 5000000000})
                    res.redirect('/chat')
                }
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
exports.login = (req, res) => {
    // check if all fields are filled
    if (req.body.login && req.body.password) {
        const newLogin = req.body.login
        const newPassword = req.body.password
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
        else {
            // check passwords
            if (LightDB.checkPassword(newLogin, newPassword) === true) {
                res.cookie("login", newLogin, {'maxAge': 5000000000})
                res.cookie("name", LightDB.getName(newLogin), {'maxAge': 5000000000})
                res.redirect('/chat')
            }
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


exports.sendChatPage = (req, res) => {
    if(req.cookies.login != null) {
         res.render('chat')
    }
    else {
        res.redirect('/login')
    }
}

exports.chatRedirect = (req, res) => {
    res.redirect('/chat')
}

exports.loginRedirect = (req, res) => {
    if(req.cookies.login != null) {
        res.redirect('/chat')
    }
    else {
        res.redirect('/login')
    }
}

exports.sendAdminPage = (req, res) => {
    res.render('admin')
}

exports.error404 = (req, res) => {
    res.render('404')
}