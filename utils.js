// js/core/utils.js
const Utils = {
    // Генерация ID из 6 цифр
    generateId() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    // Проверка возраста (18+)
    checkAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= CONSTANTS.MIN_AGE;
    },

    // Форматирование даты
    formatDate(date) {
        return new Date(date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Форматирование номера карты
    formatCardNumber(value) {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    },

    // Форматирование даты карты
    formatCardDate(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
    },

    // Конвертация изображения в base64
    async imageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Валидация карты
    validateCard(cardData) {
        const { number, expiry, cvv, holder } = cardData;
        
        if (!/^\d{16}$/.test(number.replace(/\s/g, ''))) return false;
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        if (!/^\d{3}$/.test(cvv)) return false;
        if (!/^[A-Z\s]+$/.test(holder)) return false;
        
        return true;
    },

    // Бесконечная прокрутка (дублирование товаров)
    getInfiniteProducts(products, page, pageSize) {
        if (products.length === 0) return [];
        
        const result = [];
        for (let i = 0; i < pageSize; i++) {
            const index = (page * pageSize + i) % products.length;
            result.push({
                ...products[index],
                uniqueId: `${products[index].id}_${page}_${i}`
            });
        }
        return result;
    }
};