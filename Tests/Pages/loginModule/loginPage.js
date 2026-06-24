class LoginPage{

    constructor(){
        this.loginBtnLocator = '#login-button',
        this.usernameLocator = '#user-name',
        this.passwordLocator = '#password',
        this.errorMsgLocator = "[data-test='error']",
        this.errorMsgContainerLocator = '.error-message-container',
        this.invalidCredentialsMsg = 'Epic sadface: Username and password do not match any user in this service',
        this.usernameRequiredMsg = 'Epic sadface: Username is required',
        this.passwordRequiredMsg = 'Epic sadface: Password is required',
        this.lockedOutMsg = 'Epic sadface: Sorry, this user has been locked out.'
    }   

}
module.exports = new(LoginPage)