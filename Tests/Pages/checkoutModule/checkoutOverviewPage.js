class CheckoutOverviewPage{
    constructor(){
        this.pageTitleLocator = '.title',
        this.cartItemLocator = '.cart_item',
        this.itemNameLocator = '.inventory_item_name',
        this.itemPriceLocator = '.inventory_item_price',
        this.itemTotalLocator = '.summary_subtotal_label',
        this.taxLocator = '.summary_tax_label',
        this.totalLocator = '.summary_total_label',
        this.finishBtnLocator = '#finish',
        this.cancelBtnLocator = '#cancel',
        this.pageTitle = 'Checkout: Overview',
        this.taxRate = 0.08
    }
}
module.exports = new(CheckoutOverviewPage)
