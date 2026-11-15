class CheckoutInfoPage{
    constructor(){
        this.pageTitleLocator = '.title',
        this.firstNameLocator = '#first-name',
        this.lastNameLocator = '#last-name',
        this.postalCodeLocator = '#postal-code',
        this.continueBtnLocator = '#continue',
        this.cancelBtnLocator = '#cancel',
        this.errorMsgLocator = "[data-test='error']",
        this.pageTitle = 'Checkout: Your Information',
        this.firstNameRequiredMsg = 'Error: First Name is required',
        this.lastNameRequiredMsg = 'Error: Last Name is required',
        this.postalCodeRequiredMsg = 'Error: Postal Code is required'
    }
}
module.exports = new(CheckoutInfoPage)
