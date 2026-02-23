// js/modules/user.js
const User = {
    async uploadAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const base64 = await Utils.imageToBase64(file);
                const currentUser = Storage.getCurrentUser();
                
                if (currentUser) {
                    Storage.updateUser(currentUser.id, { avatar: base64 });
                    Storage.setCurrentUser({ ...currentUser, avatar: base64 });
                    Router.navigate('profile');
                    Notifications.success('Аватар обновлен');
                }
            }
        };
        
        input.click();
    },

    blockUser(userId) {
        const user = Storage.getUserById(userId);
        if (user) {
            Storage.updateUser(userId, { blocked: true });
            Notifications.success(`Пользователь ${user.fullName} заблокирован`);
            Admin.renderUsers();
        }
    },

    unblockUser(userId) {
        const user = Storage.getUserById(userId);
        if (user) {
            Storage.updateUser(userId, { blocked: false });
            Notifications.success(`Пользователь ${user.fullName} разблокирован`);
            Admin.renderUsers();
        }
    }
};