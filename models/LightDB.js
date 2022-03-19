let database = require('./database.json')
const fs = require('fs')

class User {

    constructor(login, name, password, role) {
        this.login = login
        this.name = name
        this.password = password
        this.role = role
    };

    // user search function
    find() {
        for (let element in database[1]) {
            if (this.login === element) {
                return true
            }
        }
        return false
    }
    // user save function
    save() {
        // checking if the user exists in the database
        if (this.find() === true) {
            console.log('user already exist')
            return false
        }
        // if the user exists, add himr to the database
        else {
            this.id = database[0].nextID
            database[1][this.login] = {"id": this.id,"name": this.name, "password": hash(this.password), "role": this.role}
            database[0]["nextID"]++
            fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{})
            return true
        }
    }
    // delete user function
    delete() {
        // checking if the user exists in the database
        if (this.find() === true) {
            delete database[1][this.login]
            fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{})
            return true
        }
        else {
            console.log('not found')
            return false
        }
    }
    // user change name/password/role function
    change( property, newValue ) {
        if (this.find() === true) {
            switch( property ) {
                case "name":
                    database[1][this.login].name = newValue;
                    fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{})
                    return true
                case "password":
                    database[1][this.login].password = hash(newValue);
                    fs.writeFileSync('models/database.json', JSON.stringify(database, null, 2), ()=>{})
                    return true
                case "role":
                    database[1][this.login].role = newValue;
                    fs.writeFileSync('models/database.json', JSON.stringify(database, null, 2), ()=>{})
                    return true
                default: 
                    console.log('property does not exist, value must be = name/password/role')
                   return false
            }
        }
        else {
            console.log('not found')
            return false
        }
    }

}

module.exports.User = User

module.exports.findUser = (login) => {
    for (let element in database[1]) {
        if (login === element) {
            return true
        }
    } 
    return false  
}

module.exports.deleteUser = (login) => {
    if (findUser(login) === true) {
        delete database[1][login]
        fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{})
        return true
    }
    else {
        console.log('not found')
        return false
    }
}

module.exports.changeUser = (login, property, newValue) => {
    if (findUser(login) === true) {
        switch( property ) {
            case "name":
                database[1][login].name = newValue
                fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{})
                return true
            case "password":
                database[1][login].password = hash(newValue);
                fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{});
                return true
            case "role":
                database[1][login].role = newValue;
                fs.writeFile('models/database.json', JSON.stringify(database, null, 2), ()=>{});
                return true
            default: 
                console.log('error')
                return false
        }
    }
    else {
        console.log('not found')
        return false
    }
}

module.exports.checkPassword = (login, password) => {
    if (hash(password) === database[1][login].password) {
        return true
    }
    else {
        return false
    }
}

module.exports.getName = (login) => {
    return database[1][login].name
}

hash = (password) => {
    let newPass= ''
    const symbols = 'mw3HQWGikeFaxCrcLoDUzXdEKslMjBbq4NhfI1pgA8PYyZ67Ru0TtnO2JS5Vv9'
    let even = 0
    for (let pass in password) {
        for (let symb in symbols) {
            if (password[pass] === symbols[symb]) {
                if (even%2 === 0) {
                    if (parseInt(symb) >= 60) {
                        newPass += symbols[parseInt(symb) - 15]
                        even ++  
                    }
                    else {
                        newPass += symbols[parseInt(symb) + 2]
                    even ++
                    }
                }
                else {
                    if (parseInt(symb) >= 58) {
                        newPass += symbols[parseInt(symb) - 12] + symbols[parseInt(symb) - 7]
                    even ++
                    }
                    else {
                        newPass += symbols[parseInt(symb) + 1] + symbols[parseInt(symb) + 4]
                    even ++
                    }
                }
            }
        }
    }
    return newPass
}

