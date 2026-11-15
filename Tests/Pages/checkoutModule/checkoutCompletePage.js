class CheckoutCompletePage{
    constructor(){
        this.pageTitleLocator = '.title',
        this.completeHeaderLocator = '.complete-header',
        this.completeTextLocator = '.complete-text',
        this.backHomeBtnLocator = '#back-to-products',
        this.pageTitle = 'Checkout: Complete!',
        this.completeHeaderMsg = 'Thank you for your order!',
        this.completeTextMsg = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    }
}
module.exports = new(CheckoutCompletePage)
