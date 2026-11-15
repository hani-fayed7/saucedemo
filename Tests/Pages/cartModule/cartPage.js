class CartPage{
    constructor(){
        this.pageTitleLocator = '.title',
        this.cartItemLocator = '.cart_item',
        this.itemNameLocator = '.inventory_item_name',
        this.itemPriceLocator = '.inventory_item_price',
        this.itemQuantityLocator = '.cart_quantity',
        this.removeBtnLocator = "[data-test^='remove']",
        this.continueShoppingBtnLocator = '#continue-shopping',
        this.checkoutBtnLocator = '#checkout',
        this.pageTitle = 'Your Cart'
    }
}
module.exports = new(CartPage)
