// js/ui/render.js
const Render = {
    app: document.getElementById('app'),
    modalContainer: document.getElementById('modal-container'),

    // Очистить контент
    clear() {
        this.app.innerHTML = '';
    },

    // Приветственный экран
    welcomeScreen() {
        this.clear();
        
        const users = Storage.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        const hasUsers = users.length > 0;
        
        this.app.innerHTML = `
            <div class="welcome-screen">
                <div class="profile-icon" onclick="Auth.showAdminLoginModal()">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h1>Добро пожаловать в сервис доставки<br>бытовой техники Prince GO</h1>
                <p>Мы доставим качественную технику быстро и надёжно.</p>
                <button class="btn btn-primary" onclick="Auth.showRegisterModal()">Зарегистрироваться</button>
                ${hasUsers ? '<button class="btn btn-outline" onclick="Auth.showLoginByIdModal()" style="margin-top: 15px;">Войти по ID</button>' : ''}
            </div>
        `;
    },

    // Главный экран клиента
    clientMain(user) {
        this.clear();
        
        this.app.innerHTML = `
            <div class="header">
                <div class="logo">
                    <i class="fas fa-tools"></i>
                    <h1>Prince GO</h1>
                </div>
            </div>
            
            <div class="main-content">
                <div class="banners">
                    <div class="banner banner-ramadan">
                        <h3>🌙 Рамадан</h3>
                        <p>Скидки до 30%</p>
                    </div>
                    <div class="banner banner-blackfriday">
                        <h3>⚫ BLACK FRIDAY</h3>
                        <p>-50% на всё!</p>
                    </div>
                    <div class="banner banner-seasonal">
                        <h3>🌸 Весенняя распродажа</h3>
                        <p>Подарки каждому</p>
                    </div>
                </div>
                
                <div id="products-container" class="products-grid"></div>
            </div>
            
            ${this.bottomMenu('home')}
        `;
        
        this.renderProducts();
    },

    // Нижнее меню
    bottomMenu(active) {
        return `
            <div class="bottom-menu">
                <div class="menu-item ${active === 'home' ? 'active' : ''}" onclick="Router.navigate('client')">
                    <i class="fas fa-home"></i>
                    <span>Главный</span>
                </div>
                <div class="menu-item ${active === 'catalog' ? 'active' : ''}" onclick="Router.navigate('catalog')">
                    <i class="fas fa-search"></i>
                    <span>Каталог</span>
                </div>
                <div class="menu-item ${active === 'cart' ? 'active' : ''}" onclick="Router.navigate('cart')">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Корзина</span>
                    <span class="cart-count" id="cart-count">${Storage.getCart().length}</span>
                </div>
                <div class="menu-item ${active === 'profile' ? 'active' : ''}" onclick="Router.navigate('profile')">
                    <i class="fas fa-user"></i>
                    <span>Профиль</span>
                </div>
            </div>
        `;
    },

    // Рендер товаров
    renderProducts(category = null, page = 0) {
        const container = document.getElementById('products-container');
        if (!container) return;
        
        let products = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS) || [];
        
        if (category) {
            products = products.filter(p => p.category === category);
        }
        
        // Бесконечная прокрутка
        const pageProducts = Utils.getInfiniteProducts(products, page, 20);
        
        container.innerHTML = pageProducts.map(product => `
            <div class="product-card">
                <img src="${product.images[0] || 'assets/default-product.png'}" alt="${product.name}" class="product-image" onclick="Modals.showProductDetails('${product.id}')">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${product.price} ₽</div>
                    <div class="product-actions">
                        <button class="btn btn-outline btn-sm" onclick="Modals.showProductDetails('${product.id}')">Подробнее</button>
                        <button class="btn btn-primary btn-sm" onclick="Cart.addToCart('${product.id}')">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Бесконечный скролл
        this.setupInfiniteScroll();
    },

    // Каталог
    catalog() {
        this.clear();
        
        this.app.innerHTML = `
            <div class="header">
                <div class="logo">
                    <i class="fas fa-tools"></i>
                    <h1>Prince GO</h1>
                </div>
            </div>
            
            <div class="main-content">
                <div class="categories">
                    ${CONSTANTS.CATEGORIES.map(cat => `
                        <div class="category-item" onclick="Render.filterByCategory('${cat}')">
                            ${cat}
                        </div>
                    `).join('')}
                </div>
                
                <div id="products-container" class="products-grid"></div>
            </div>
            
            ${this.bottomMenu('catalog')}
        `;
        
        this.renderProducts();
    },

    // Фильтр по категории
    filterByCategory(category) {
        const container = document.getElementById('products-container');
        const categories = document.querySelectorAll('.category-item');
        
        categories.forEach(c => {
            if (c.textContent === category) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });
        
        this.renderProducts(category);
    },

    // Корзина
    cart() {
        this.clear();
        const cart = Storage.getCart();
        
        this.app.innerHTML = `
            <div class="header">
                <div class="logo">
                    <i class="fas fa-tools"></i>
                    <h1>Prince GO</h1>
                </div>
            </div>
            
            <div class="main-content">
                <div class="cart-header">
                    <h2>Корзина</h2>
                    <div>
                        <input type="checkbox" id="select-all" onchange="Cart.selectAll()">
                        <label for="select-all">Выбрать все</label>
                    </div>
                </div>
                
                <div class="cart-items" id="cart-items"></div>
                
                ${cart.length > 0 ? `
                    <div class="cart-total">
                        <button class="btn btn-primary" onclick="Cart.checkout()">Оформить заказ</button>
                    </div>
                ` : ''}
            </div>
            
            ${this.bottomMenu('cart')}
        `;
        
        this.renderCartItems();
    },

    // Рендер элементов корзины
    renderCartItems() {
        const container = document.getElementById('cart-items');
        if (!container) return;
        
        const cart = Storage.getCart();
        
        container.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <input type="checkbox" class="item-checkbox" onchange="Cart.updateTotal()">
                <img src="${item.images[0]}" alt="${item.name}" onclick="Modals.showProductDetails('${item.id}')">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="product-price">${item.price} ₽</div>
                    <div>Количество: ${item.quantity || 1}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-danger btn-sm" onclick="Cart.removeFromCart('${item.id}')">Удалить</button>
                    <button class="btn btn-primary btn-sm" onclick="Cart.orderItem('${item.id}')">Заказать</button>
                </div>
            </div>
        `).join('');
    },

    // Профиль
    profile() {
        this.clear();
        const user = Storage.getCurrentUser();
        const orders = Storage.getUserOrders(user.id);
        const cartCount = Storage.getCart().length;
        
        this.app.innerHTML = `
            <div class="header">
                <div class="logo">
                    <i class="fas fa-tools"></i>
                    <h1>Prince GO</h1>
                </div>
                <div class="hamburger-menu" onclick="Modals.showMenu()">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
            
            <div class="main-content">
                <div class="profile-header">
                    <div class="avatar" onclick="User.uploadAvatar()">
                        ${user.avatar ? `<img src="${user.avatar}" alt="avatar">` : '<i class="fas fa-user-circle"></i>'}
                    </div>
                    <div>
                        <h2>${user.fullName}</h2>
                        <button class="btn btn-outline btn-sm" onclick="Modals.showUserData()">Мои данные</button>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>${cartCount}</h3>
                        <p>В корзине</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-history"></i>
                        <h3>${orders.length}</h3>
                        <p>История</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-truck"></i>
                        <h3>${orders.filter(o => o.status === CONSTANTS.ORDER_STATUS.DELIVERING).length}</h3>
                        <p>В пути</p>
                    </div>
                </div>
                
                <div class="orders-list" id="orders-list"></div>
            </div>
            
            ${this.bottomMenu('profile')}
        `;
        
        this.renderOrders();
    },

    // Рендер заказов
    renderOrders() {
        const container = document.getElementById('orders-list');
        if (!container) return;
        
        const user = Storage.getCurrentUser();
        const orders = Storage.getUserOrders(user.id);
        
        container.innerHTML = `
            <h3>Мои заказы</h3>
            ${orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <span>Заказ #${order.id}</span>
                        <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div class="order-body">
                        <p>Товаров: ${order.items.length}</p>
                        <p>Сумма: ${order.total} ₽</p>
                        <p>Дата: ${Utils.formatDate(order.createdAt)}</p>
                    </div>
                    <div class="order-actions">
                        ${order.status === CONSTANTS.ORDER_STATUS.PROCESSING ? 
                            `<button class="btn btn-danger btn-sm" onclick="Orders.cancelOrder('${order.id}')">Отменить заказ</button>` :
                            order.status === CONSTANTS.ORDER_STATUS.CONFIRMED ?
                            `<button class="btn btn-danger btn-sm" onclick="Orders.cancelOrder('${order.id}')">Отменить заказ</button>` :
                            '<button class="btn btn-secondary btn-sm" disabled>Отмена невозможна</button>'
                        }
                    </div>
                </div>
            `).join('')}
        `;
    },

    // Бесконечный скролл
    setupInfiniteScroll() {
        let page = 0;
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                page++;
                this.renderProducts(null, page);
            }
        });
    }
};