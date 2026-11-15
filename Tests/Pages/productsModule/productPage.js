class ProductPage{
    constructor(){
        this.shoppingCartLocator = '.shopping_cart_link',
        this.burgerMenuLocator = '.bm-burger-button',
        this.productSortLocator = '.product_sort_container',
        this.pageTitleLocator = '.title',
        this.cartBadgeLocator = '.shopping_cart_badge',
        this.inventoryItemLocator = '.inventory_item',
        this.itemNameLocator = '.inventory_item_name',
        this.itemPriceLocator = '.inventory_item_price',
        this.itemDescLocator = '.inventory_item_desc',
        this.itemImgLocator = '.inventory_item img',
        this.itemBtnLocator = 'button',
        this.addToCartBtnLocator = "[data-test^='add-to-cart']",
        this.removeBtnLocator = "[data-test^='remove']",
        this.visualFailureLocator = '.visual_failure, .btn_inventory_misaligned',
        this.pageTitle = 'Products',
        this.productsCount = 6,
        this.addToCartBtnText = 'Add to cart',
        this.removeBtnText = 'Remove'
    }
}
module.exports = new(ProductPage)
