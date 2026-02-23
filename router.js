// js/core/router.js
const Router = {
    currentPage: 'welcome',
    
    // Навигация
    navigate(page, data = null) {
        this.currentPage = page;
        
        switch(page) {
            case 'welcome':
                Render.welcomeScreen();
                break;
            case 'client':
                Render.clientMain(data);
                break;
            case 'admin':
                Render.adminPanel();
                break;
            case 'catalog':
                Render.catalog(data);
                break;
            case 'cart':
                Render.cart();
                break;
            case 'profile':
                Render.profile();
                break;
            default:
                Render.welcomeScreen();
        }
    },

    // Показать модальное окно
    showModal(modalId, data = null) {
        Modals.show(modalId, data);
    },

    // Закрыть модальное окно
    closeModal() {
        Modals.hide();
    }
};