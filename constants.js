// js/config/constants.js
const CONSTANTS = {
    APP_NAME: 'Prince GO',
    STORAGE_KEYS: {
        USERS: 'prince_go_users',
        PRODUCTS: 'prince_go_products',
        ORDERS: 'prince_go_orders',
        CURRENT_USER: 'prince_go_current_user',
        CART: 'prince_go_cart',
        PAYMENT_METHODS: 'prince_go_payment_methods'
    },
    USER_ROLES: {
        CLIENT: 'client',
        ADMIN: 'admin'
    },
    ORDER_STATUS: {
        PROCESSING: 'В обработке',
        CONFIRMED: 'Оформлен',
        DELIVERING: 'В пути',
        DELIVERED: 'Доставлен',
        CANCELLED: 'Отменен'
    },
    PAYMENT_METHODS: {
        CASH: 'Наличные',
        CARD: 'Банковская карта'
    },
    CATEGORIES: [
        'Холодильники',
        'Микроволновки',
        'Пылесосы',
        'Стиральные машины',
        'Телевизоры'
    ],
    MIN_AGE: 18
};