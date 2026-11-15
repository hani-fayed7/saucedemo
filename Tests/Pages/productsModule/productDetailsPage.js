class ProductDetailsPage{
    constructor(){
        this.itemNameLocator = '.inventory_details_name',
        this.itemDescLocator = '.inventory_details_desc',
        this.itemPriceLocator = '.inventory_details_price',
        this.itemImgLocator = '.inventory_details_img',
        this.addToCartBtnLocator = '#add-to-cart',
        this.removeBtnLocator = '#remove',
        this.backToProductsBtnLocator = '#back-to-products'
    }
}
module.exports = new(ProductDetailsPage)
