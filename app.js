// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация хранилища
    Storage.init();
    
    // Проверяем, есть ли текущий пользователь
    const currentUser = Storage.getCurrentUser();
    
    if (currentUser) {
        if (currentUser.role === CONSTANTS.USER_ROLES.ADMIN) {
            Router.navigate('admin');
        } else {
            Router.navigate('client');
        }
    } else {
        Router.navigate('welcome');
    }
    
    // Добавляем обработчики для модальных окон
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Modals.hide();
        }
    });
    
    // Закрытие модального окна при клике на фон
    document.getElementById('modal-container').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            Modals.hide();
        }
    });
});

// Экспортируем для глобального доступа
window.Router = Router;
window.Modals = Modals;
window.Auth = Auth;
window.User = User;
window.Products = Products;
window.Cart = Cart;
window.Orders = Orders;
window.Payment = Payment;
window.Admin = Admin;
window.Render = Render;
window.Notifications = Notifications;