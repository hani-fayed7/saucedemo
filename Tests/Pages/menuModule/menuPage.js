class MenuPage{
    constructor(){
        this.openMenuBtnLocator = '#react-burger-menu-btn',
        this.closeMenuBtnLocator = '#react-burger-cross-btn',
        this.menuWrapLocator = '.bm-menu-wrap',
        this.allItemsLinkLocator = '#inventory_sidebar_link',
        this.aboutLinkLocator = '#about_sidebar_link',
        this.logoutLinkLocator = '#logout_sidebar_link',
        this.resetAppStateLinkLocator = '#reset_sidebar_link',
        this.aboutUrl = 'https://saucelabs.com/'
    }
}
module.exports = new(MenuPage)
