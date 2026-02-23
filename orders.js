// js/modules/orders.js
const Orders = {
    create(productId) {
        const user = Storage.getCurrentUser();
        const product = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS).find(p => p.id === productId);
        
        const order = {
            id: Utils.generateId(),
            userId: user.id,
            items: [product],
            total: product.price,
            status: CONSTANTS.ORDER_STATUS.PROCESSING,
            paymentMethod: user.paymentMethod,
            createdAt: new Date().toISOString()
        };

        Storage.addOrder(order);
        Modals.hide();
        
        setTimeout(() => {
            Notifications.success('Заказ оформлен! Следите за статусом в профиле');
        }, 300);
    },

    cancelOrder(orderId) {
        const order = Storage.getItem(CONSTANTS.STORAGE_KEYS.ORDERS).find(o => o.id === orderId);
        
        if (order && (order.status === CONSTANTS.ORDER_STATUS.PROCESSING || 
                     order.status === CONSTANTS.ORDER_STATUS.CONFIRMED)) {
            Storage.updateOrder(orderId, { status: CONSTANTS.ORDER_STATUS.CANCELLED });
            Notifications.success('Заказ отменен');
            Router.navigate('profile');
        } else {
            Notifications.error('Заказ нельзя отменить');
        }
    },

    updateStatus(orderId, newStatus) {
        const order = Storage.getItem(CONSTANTS.STORAGE_KEYS.ORDERS).find(o => o.id === orderId);
        
        if (order) {
            const statuses = [
                CONSTANTS.ORDER_STATUS.PROCESSING,
                CONSTANTS.ORDER_STATUS.CONFIRMED,
                CONSTANTS.ORDER_STATUS.DELIVERING,
                CONSTANTS.ORDER_STATUS.DELIVERED
            ];
            
            const currentIndex = statuses.indexOf(order.status);
            const newIndex = statuses.indexOf(newStatus);
            
            // Можно менять только по порядку
            if (newIndex === currentIndex + 1 || newStatus === CONSTANTS.ORDER_STATUS.CANCELLED) {
                Storage.updateOrder(orderId, { status: newStatus });
                Notifications.success('Статус заказа обновлен');
                Admin.renderOrders();
            } else {
                Notifications.error('Нельзя изменить статус');
            }
        }
    },

    getUserOrders() {
        const user = Storage.getCurrentUser();
        return Storage.getUserOrders(user.id);
    }
};