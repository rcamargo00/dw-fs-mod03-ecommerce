class User{
    constructor({username, email, password, roles}){
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = roles || ['user'];
    }
}

module.exports = User;