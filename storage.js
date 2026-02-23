// js/core/storage.js
const Storage = {
    // Инициализация хранилища
    init() {
        if (!localStorage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS)) {
            this.setItem(CONSTANTS.STORAGE_KEYS.PRODUCTS, defaultProducts);
        }
        
        if (!localStorage.getItem(CONSTANTS.STORAGE_KEYS.USERS)) {
            this.setItem(CONSTANTS.STORAGE_KEYS.USERS, []);
        }
        
        if (!localStorage.getItem(CONSTANTS.STORAGE_KEYS.ORDERS)) {
            this.setItem(CONSTANTS.STORAGE_KEYS.ORDERS, []);
        }
        
        if (!localStorage.getItem(CONSTANTS.STORAGE_KEYS.CART)) {
            this.setItem(CONSTANTS.STORAGE_KEYS.CART, []);
        }
    },

    // Получить элемент
    getItem(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },

    // Сохранить элемент
    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Добавить пользователя
    addUser(user) {
        const users = this.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        users.push(user);
        this.setItem(CONSTANTS.STORAGE_KEYS.USERS, users);
        return user;
    },

    // Получить пользователя по ID
    getUserById(id) {
        const users = this.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        return users.find(u => u.id === id);
    },

    // Получить пользователя по телефону
    getUserByPhone(phone) {
        const users = this.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        return users.find(u => u.phone === phone);
    },

    // Обновить пользователя
    updateUser(id, updates) {
        const users = this.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.setItem(CONSTANTS.STORAGE_KEYS.USERS, users);
            return users[index];
        }
        return null;
    },

    // Добавить товар
    addProduct(product) {
        const products = this.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS) || [];
        product.id = Utils.generateId();
        products.push(product);
        this.setItem(CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
        return product;
    },

    // Обновить товар
    updateProduct(id, updates) {
        const products = this.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS) || [];
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            this.setItem(CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
            return products[index];
        }
        return null;
    },

    // Удалить товар
    deleteProduct(id) {
        let products = this.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS) || [];
        products = products.filter(p => p.id !== id);
        this.setItem(CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
    },

    // Добавить заказ
    addOrder(order) {
        const orders = this.getItem(CONSTANTS.STORAGE_KEYS.ORDERS) || [];
        order.id = Utils.generateId();
        order.createdAt = new Date().toISOString();
        orders.push(order);
        this.setItem(CONSTANTS.STORAGE_KEYS.ORDERS, orders);
        return order;
    },

    // Обновить заказ
    updateOrder(id, updates) {
        const orders = this.getItem(CONSTANTS.STORAGE_KEYS.ORDERS) || [];
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index] = { ...orders[index], ...updates };
            this.setItem(CONSTANTS.STORAGE_KEYS.ORDERS, orders);
            return orders[index];
        }
        return null;
    },

    // Получить заказы пользователя
    getUserOrders(userId) {
        const orders = this.getItem(CONSTANTS.STORAGE_KEYS.ORDERS) || [];
        return orders.filter(o => o.userId === userId);
    },

    // Получить корзину
    getCart() {
        return this.getItem(CONSTANTS.STORAGE_KEYS.CART) || [];
    },

    // Сохранить корзину
    saveCart(cart) {
        this.setItem(CONSTANTS.STORAGE_KEYS.CART, cart);
    },

    // Добавить в корзину
    addToCart(product) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart(cart);
        return cart;
    },

    // Удалить из корзины
    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        return cart;
    },

    // Очистить корзину
    clearCart() {
        this.setItem(CONSTANTS.STORAGE_KEYS.CART, []);
    },

    // Получить текущего пользователя
    getCurrentUser() {
        return this.getItem(CONSTANTS.STORAGE_KEYS.CURRENT_USER);
    },

    // Установить текущего пользователя
    setCurrentUser(user) {
        this.setItem(CONSTANTS.STORAGE_KEYS.CURRENT_USER, user);
    },

    // Выход
    logout() {
        this.setItem(CONSTANTS.STORAGE_KEYS.CURRENT_USER, null);
        this.setItem(CONSTANTS.STORAGE_KEYS.CART, []);
    }
};