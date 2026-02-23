// js/modules/auth.js
const Auth = {
    showRegisterModal() {
        Modals.show('register');
    },

    showAdminLoginModal() {
        Modals.show('adminLogin');
    },

    showLoginByIdModal() {
        Modals.show('loginById');
    },

    register() {
        const fullName = document.getElementById('fullName').value;
        const birthDate = document.getElementById('birthDate').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        if (!fullName || !birthDate || !phone || !address) {
            Notifications.error('Заполните все поля');
            return;
        }

        if (!Utils.checkAge(birthDate)) {
            Notifications.error('Вам должно быть 18 лет и старше');
            return;
        }

        const user = {
            id: Utils.generateId(),
            fullName,
            birthDate,
            phone,
            address,
            age: new Date().getFullYear() - new Date(birthDate).getFullYear(),
            role: CONSTANTS.USER_ROLES.CLIENT,
            blocked: false,
            avatar: null,
            paymentMethod: null,
            createdAt: new Date().toISOString()
        };

        Storage.addUser(user);
        Storage.setCurrentUser(user);
        
        Modals.hide();
        
        // Показываем модальное окно с данными пользователя
        setTimeout(() => {
            Modals.show('userInfo', user);
        }, 100);
        
        // После закрытия показываем главный экран
        setTimeout(() => {
            Router.navigate('client');
        }, 500);
        
        Notifications.success('Регистрация успешна! Ваш ID: ' + user.id);
    },

    adminLogin() {
        const login = document.getElementById('adminLogin').value;
        const password = document.getElementById('adminPassword').value;

        if (login === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
            const admin = {
                id: 'ADMIN',
                fullName: 'Администратор',
                role: CONSTANTS.USER_ROLES.ADMIN
            };
            
            Storage.setCurrentUser(admin);
            Modals.hide();
            Router.navigate('admin');
            Notifications.success('Вход выполнен успешно');
        } else {
            Notifications.error('Неверный логин или пароль');
        }
    },

    loginById() {
        const id = document.getElementById('userId').value;
        const user = Storage.getUserById(id);

        if (!user) {
            Notifications.error('Пользователь не найден');
            return;
        }

        if (user.blocked) {
            Notifications.error('Пользователь заблокирован');
            return;
        }

        Storage.setCurrentUser(user);
        Modals.hide();
        Router.navigate('client');
        Notifications.success(`Добро пожаловать, ${user.fullName}!`);
    },

    logout() {
        Storage.logout();
        Router.navigate('welcome');
        Notifications.success('Вы вышли из системы');
    }
};