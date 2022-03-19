const LightDB = require('../models/LightDB')
const User = LightDB.User

exports.sendRegisterPage = (req, res) => {
    res.render('login', {
        pageName: 'Register',
        action: 'register',
        name: true,
        buttonValue: 'зарегистрироваться',
        href: '/',
        back: 'вернуться',
    })
}

exports.registration = (req, res) => {
    // check if all fields are filled
    if (req.body.login && req.body.name && req.body.password) {
        const newLogin = req.body.login
        const newName = req.body.name
        const newPassword = req.body.password
        // user presence check
        if(LightDB.findUser(newLogin) === false) {
            // if not add new user
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
                    errorMessage: 'ошибка регистрации',
                    buttonValue: 'зарегистрироваться',
                    href: '/',
                    back: 'вернуться',
                })
            }
        } 
        else {
            res.render('login', {
                pagename: 'Register',
                action: 'register',
                name: true,
                errorMessage: 'этот логин занят',
                buttonValue: 'зарегистрироваться',
                href: '/',
                back: 'вернуться',
            });
        };
    }
    else {
        res.render('login', {
            pagename: 'Register',
            action: 'register',
            name: true,
            errorMessage: 'не все поля заполнены',
            buttonValue: 'зарегистрироваться',
            href: '/',
            back: 'вернуться',
        });
    };
};

exports.sendLoginPage = (req, res) => {
    res.render('login', {
        pageName: 'login',
        action: 'login',
        buttonValue: 'войти',
        href: '/register',
        back: 'зарегистрироваться',
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
                href: '/register',
                back: 'зарегистрироваться',
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
                    href: '/register',
                    back: 'зарегистрироваться',
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
            href: '/register',
            back: 'зарегистрироваться',
        })
    }
}


exports.sendChatPage = (req, res) => {
    if(req.cookies.login != null) {
         res.render('chat')
    }
    else {
        res.redirect('/login')
    };
};

exports.loginRedirect = (req, res) => {
    if(req.cookies.login != null) {
        res.redirect('/chat')
    }
    else {
        res.redirect('/login')
    };
};

exports.error404 = (req, res) => {
    res.render('404')
}