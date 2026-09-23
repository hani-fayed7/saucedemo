class ProductPage{
    constructor(){
        this.shoppingCartLocator = '.shopping_cart_link',
        this.burgerMenuLocator = '.bm-burger-button',
        this.productSortLocator = '.product_sort_container'
    }
}
module.exports = new(ProductPage)