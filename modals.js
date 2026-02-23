// js/ui/modals.js
const Modals = {
    show(modalId, data = null) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.remove('hidden');
        
        switch(modalId) {
            case 'register':
                this.registerModal();
                break;
            case 'adminLogin':
                this.adminLoginModal();
                break;
            case 'loginById':
                this.loginByIdModal();
                break;
            case 'userInfo':
                this.userInfoModal(data);
                break;
            case 'productDetails':
                this.productDetailsModal(data);
                break;
            case 'checkout':
                this.checkoutModal(data);
                break;
            case 'payment':
                this.paymentModal(data);
                break;
            case 'cardPayment':
                this.cardPaymentModal(data);
                break;
            case 'adminProduct':
                this.adminProductModal(data);
                break;
            case 'userDetails':
                this.userDetailsModal(data);
                break;
            case 'menu':
                this.menuModal();
                break;
            case 'help':
                this.helpModal();
                break;
            case 'about':
                this.aboutModal();
                break;
        }
    },

    hide() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.classList.add('hidden');
        modalContainer.innerHTML = '';
    },

    registerModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Регистрация</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="register-form">
                        <div class="form-group">
                            <label>ФИО</label>
                            <input type="text" id="fullName" required>
                        </div>
                        <div class="form-group">
                            <label>Дата рождения</label>
                            <input type="date" id="birthDate" required>
                        </div>
                        <div class="form-group">
                            <label>Номер телефона</label>
                            <input type="tel" id="phone" placeholder="+7 (999) 999-99-99" required>
                        </div>
                        <div class="form-group">
                            <label>Адрес доставки</label>
                            <input type="text" id="address" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Отменить</button>
                    <button class="btn btn-primary" onclick="Auth.register()">Зарегистрироваться</button>
                </div>
            </div>
        `;
    },

    adminLoginModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Вход администратора</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="admin-login-form">
                        <div class="form-group">
                            <label>Логин</label>
                            <input type="text" id="adminLogin" required>
                        </div>
                        <div class="form-group">
                            <label>Пароль</label>
                            <input type="password" id="adminPassword" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Отменить</button>
                    <button class="btn btn-primary" onclick="Auth.adminLogin()">Войти</button>
                </div>
            </div>
        `;
    },

    loginByIdModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Вход по ID</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="login-by-id-form">
                        <div class="form-group">
                            <label>Ваш ID (6 цифр)</label>
                            <input type="text" id="userId" maxlength="6" pattern="\\d{6}" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Отменить</button>
                    <button class="btn btn-primary" onclick="Auth.loginById()">Войти</button>
                </div>
            </div>
        `;
    },

    userInfoModal(user) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Информация о пользователе</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <p><strong>ФИО:</strong> ${user.fullName}</p>
                    <p><strong>Телефон:</strong> ${user.phone}</p>
                    <p><strong>Адрес:</strong> ${user.address}</p>
                    <p><strong>Дата рождения:</strong> ${user.birthDate}</p>
                    <p><strong>Возраст:</strong> ${user.age} лет</p>
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Способ оплаты:</strong> ${user.paymentMethod || 'Не указано'}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="Modals.hide()">OK</button>
                </div>
            </div>
        `;
    },

    productDetailsModal(productId) {
        const product = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS).find(p => p.id === productId);
        const modalContainer = document.getElementById('modal-container');
        
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>${product.name}</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="image-gallery">
                        ${product.images.map(img => `<img src="${img}" class="gallery-image" onclick="Modals.expandImage('${img}')">`).join('')}
                    </div>
                    <h3>${product.price} ₽</h3>
                    <p><strong>Доставка:</strong> 5 рабочих дней</p>
                    <div class="product-description">
                        <p id="short-description">${product.description.substring(0, 100)}...</p>
                        <p id="full-description" class="hidden">${product.description}</p>
                        <button class="btn btn-outline btn-sm" onclick="Modals.toggleDescription()">Читать полностью</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Закрыть</button>
                    <button class="btn btn-primary" onclick="Modals.checkoutModal('${productId}')">Заказать</button>
                </div>
            </div>
        `;
    },

    checkoutModal(productId) {
        const product = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS).find(p => p.id === productId);
        const user = Storage.getCurrentUser();
        const modalContainer = document.getElementById('modal-container');
        
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Оформление заказа</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="order-preview">
                        <img src="${product.images[0]}" style="width: 100px; height: 100px; object-fit: cover;">
                        <h3>${product.name}</h3>
                        <p class="product-price">${product.price} ₽</p>
                    </div>
                    
                    ${!user.paymentMethod ? `
                        <div class="payment-warning">
                            <p>Способ оплаты не указан</p>
                            <button class="btn btn-primary" onclick="Modals.paymentModal()">Указать способ оплаты</button>
                        </div>
                    ` : `
                        <p>Способ оплаты: ${user.paymentMethod}</p>
                        <button class="btn btn-primary" onclick="Orders.create('${productId}')">Подтвердить заказ</button>
                    `}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Отменить</button>
                </div>
            </div>
        `;
    },

    paymentModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Выбор способа оплаты</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="payment-options">
                        <button class="btn btn-outline" onclick="Payment.selectCash()">
                            <i class="fas fa-money-bill"></i> Наличные
                        </button>
                        <button class="btn btn-outline" onclick="Modals.cardPaymentModal()">
                            <i class="fas fa-credit-card"></i> Банковская карта
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Отменить</button>
                </div>
            </div>
        `;
    },

    cardPaymentModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Данные карты</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="card-form">
                        <div class="form-group">
                            <label>Номер карты</label>
                            <input type="text" class="card-input" id="cardNumber" maxlength="19" placeholder="0000 0000 0000 0000" oninput="Payment.formatCardNumber(this)">
                        </div>
                        <div class="form-group">
                            <label>MM/YY</label>
                            <input type="text" id="cardExpiry" maxlength="5" placeholder="MM/YY" oninput="Payment.formatCardExpiry(this)">
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" id="cardCvv" maxlength="3" placeholder="000">
                        </div>
                        <div class="form-group">
                            <label>Имя владельца (латиница)</label>
                            <input type="text" id="cardHolder" oninput="this.value = this.value.toUpperCase()">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Отменить</button>
                    <button class="btn btn-primary" onclick="Payment.saveCard()">Подтвердить</button>
                </div>
            </div>
        `;
    },

    menuModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Меню</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="menu-items">
                        <div class="menu-item" onclick="Modals.helpModal()">
                            <i class="fas fa-question-circle"></i> Помощь
                        </div>
                        <div class="menu-item" onclick="Modals.aboutModal()">
                            <i class="fas fa-info-circle"></i> О сервисе
                        </div>
                        <div class="menu-item" onclick="Modals.instructionsModal()">
                            <i class="fas fa-book"></i> Инструкция
                        </div>
                        <div class="menu-item" onclick="Auth.logout()">
                            <i class="fas fa-sign-out-alt"></i> Выход
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    helpModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>Помощь</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Можете обратиться в наш Telegram бот:</p>
                    <a href="https://t.me/princegobot" target="_blank" class="btn btn-primary">
                        <i class="fab fa-telegram"></i> @princegobot
                    </a>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="Modals.hide()">Закрыть</button>
                </div>
            </div>
        `;
    },

    aboutModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>О сервисе</h2>
                    <span class="close-btn" onclick="Modals.hide()">&times;</span>
                </div>
                <div class="modal-body">
                    <h3>Prince GO - сервис доставки бытовой техники</h3>
                    <p>Проект разработан студентами:</p>
                    <ul>
                        <li>Имадылов Арсен (302-ПКС-3)</li>
                        <li>Саламатов Азат</li>
                    </ul>
                    <p>Учебный проект 2024</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="Modals.hide()">Закрыть</button>
                </div>
            </div>
        `;
    },

    toggleDescription() {
        const shortDesc = document.getElementById('short-description');
        const fullDesc = document.getElementById('full-description');
        const btn = event.target;
        
        if (fullDesc.classList.contains('hidden')) {
            fullDesc.classList.remove('hidden');
            shortDesc.classList.add('hidden');
            btn.textContent = 'Скрыть';
        } else {
            fullDesc.classList.add('hidden');
            shortDesc.classList.remove('hidden');
            btn.textContent = 'Читать полностью';
        }
    }
};