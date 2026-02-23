// js/modules/admin.js
const Admin = {
    panel() {
        Render.clear();
        
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="admin-panel">
                <div class="header">
                    <h1>Панель администратора</h1>
                    <button class="btn btn-danger" onclick="Auth.logout()">Выйти</button>
                </div>
                
                <div class="admin-tabs">
                    <button class="tab-btn active" onclick="Admin.showTab('products')">Товары</button>
                    <button class="tab-btn" onclick="Admin.showTab('users')">Пользователи</button>
                    <button class="tab-btn" onclick="Admin.showTab('orders')">Заказы</button>
                </div>
                
                <div id="admin-content" class="admin-content"></div>
            </div>
        `;
        
        this.showTab('products');
    },

    showTab(tab) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        switch(tab) {
            case 'products':
                this.renderProducts();
                break;
            case 'users':
                this.renderUsers();
                break;
            case 'orders':
                this.renderOrders();
                break;
        }
    },

    renderProducts() {
        const container = document.getElementById('admin-content');
        const products = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS) || [];
        
        container.innerHTML = `
            <div class="admin-section">
                <div class="section-header">
                    <h2>Управление товарами</h2>
                    <button class="btn btn-primary" onclick="Modals.show('adminProduct')">+ Добавить товар</button>
                </div>
                
                <div class="products-list">
                    ${products.map(product => `
                        <div class="admin-item">
                            <img src="${product.images[0]}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
                            <div class="item-info">
                                <h4>${product.name}</h4>
                                <p>${product.price} ₽ | ${product.category}</p>
                            </div>
                            <div class="item-actions">
                                <button class="action-btn edit" onclick="Products.edit('${product.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="Products.delete('${product.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderUsers() {
        const container = document.getElementById('admin-content');
        const users = Storage.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        const orders = Storage.getItem(CONSTANTS.STORAGE_KEYS.ORDERS) || [];
        
        container.innerHTML = `
            <div class="admin-section">
                <h2>Управление пользователями</h2>
                
                <div class="users-list">
                    ${users.map(user => {
                        const userOrders = orders.filter(o => o.userId === user.id);
                        const inTransit = userOrders.filter(o => o.status === CONSTANTS.ORDER_STATUS.DELIVERING).length;
                        
                        return `
                            <div class="admin-item ${user.blocked ? 'blocked' : ''}">
                                <div class="item-info">
                                    <h4>${user.fullName}</h4>
                                    <p>Заказов: ${userOrders.length} | В пути: ${inTransit} | ID: ${user.id}</p>
                                    <p>Телефон: ${user.phone}</p>
                                </div>
                                <div class="item-actions">
                                    <button class="action-btn view" onclick="Modals.show('userDetails', '${user.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${user.blocked ? 
                                        `<button class="action-btn edit" onclick="User.unblockUser('${user.id}')">
                                            <i class="fas fa-unlock"></i> Разблокировать
                                        </button>` :
                                        `<button class="action-btn delete" onclick="User.blockUser('${user.id}')">
                                            <i class="fas fa-ban"></i> Заблокировать
                                        </button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderOrders() {
        const container = document.getElementById('admin-content');
        const orders = Storage.getItem(CONSTANTS.STORAGE_KEYS.ORDERS) || [];
        const users = Storage.getItem(CONSTANTS.STORAGE_KEYS.USERS) || [];
        
        container.innerHTML = `
            <div class="admin-section">
                <h2>Управление заказами</h2>
                
                <div class="orders-list">
                    ${orders.map(order => {
                        const user = users.find(u => u.id === order.userId);
                        
                        return `
                            <div class="admin-item">
                                <div class="item-info">
                                    <h4>Заказ #${order.id}</h4>
                                    <p>Клиент: ${user ? user.fullName : 'Неизвестно'} (ID: ${order.userId})</p>
                                    <p>Дата: ${Utils.formatDate(order.createdAt)}</p>
                                    <p>Сумма: ${order.total} ₽</p>
                                    <p>Статус: <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                                </div>
                                <div class="item-actions">
                                    <select onchange="Orders.updateStatus('${order.id}', this.value)">
                                        <option value="${CONSTANTS.ORDER_STATUS.PROCESSING}" ${order.status === CONSTANTS.ORDER_STATUS.PROCESSING ? 'selected' : ''}>
                                            В обработке
                                        </option>
                                        <option value="${CONSTANTS.ORDER_STATUS.CONFIRMED}" ${order.status === CONSTANTS.ORDER_STATUS.CONFIRMED ? 'selected' : ''}>
                                            Оформлен
                                        </option>
                                        <option value="${CONSTANTS.ORDER_STATUS.DELIVERING}" ${order.status === CONSTANTS.ORDER_STATUS.DELIVERING ? 'selected' : ''}>
                                            В пути
                                        </option>
                                        <option value="${CONSTANTS.ORDER_STATUS.DELIVERED}" ${order.status === CONSTANTS.ORDER_STATUS.DELIVERED ? 'selected' : ''}>
                                            Доставлен
                                        </option>
                                    </select>
                                    
                                    ${order.status !== CONSTANTS.ORDER_STATUS.DELIVERED && 
                                      order.status !== CONSTANTS.ORDER_STATUS.CANCELLED ?
                                        `<button class="btn btn-danger btn-sm" onclick="Orders.updateStatus('${order.id}', '${CONSTANTS.ORDER_STATUS.CANCELLED}')">
                                            Отменить
                                        </button>` : ''
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};