// js/modules/cart.js
const Cart = {
    addToCart(productId) {
        const products = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS);
        const product = products.find(p => p.id === productId);
        
        if (product) {
            Storage.addToCart(product);
            this.updateCartCount();
            Notifications.success('Товар добавлен в корзину');
        }
    },

    removeFromCart(productId) {
        Storage.removeFromCart(productId);
        Render.renderCartItems();
        this.updateCartCount();
        Notifications.success('Товар удален из корзины');
    },

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = Storage.getCart().length;
            cartCount.textContent = count;
        }
    },

    selectAll() {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        const selectAll = document.getElementById('select-all');
        
        checkboxes.forEach(cb => {
            cb.checked = selectAll.checked;
        });
    },

    updateTotal() {
        // Обновление общей суммы выбранных товаров
        const checkboxes = document.querySelectorAll('.item-checkbox:checked');
        let total = 0;
        
        checkboxes.forEach(cb => {
            const cartItem = cb.closest('.cart-item');
            const price = parseInt(cartItem.querySelector('.product-price').textContent);
            total += price;
        });
    },

    orderItem(productId) {
        Modals.show('checkout', productId);
    },

    checkout() {
        const cart = Storage.getCart();
        if (cart.length === 0) {
            Notifications.error('Корзина пуста');
            return;
        }

        const user = Storage.getCurrentUser();
        if (!user) {
            Notifications.error('Необходимо войти в систему');
            return;
        }

        if (!user.paymentMethod) {
            Modals.show('payment');
            return;
        }

        this.createOrder(cart);
    },

    createOrder(cart) {
        const user = Storage.getCurrentUser();
        const order = {
            userId: user.id,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
            status: CONSTANTS.ORDER_STATUS.PROCESSING,
            paymentMethod: user.paymentMethod,
            createdAt: new Date().toISOString()
        };

        Storage.addOrder(order);
        Storage.clearCart();
        this.updateCartCount();
        
        Modals.hide();
        Notifications.success('Заказ успешно оформлен! Статус заказа можно отслеживать в профиле');
        Router.navigate('profile');
    }
};