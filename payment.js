// js/modules/payment.js
const Payment = {
    selectCash() {
        const user = Storage.getCurrentUser();
        Storage.updateUser(user.id, { paymentMethod: CONSTANTS.PAYMENT_METHODS.CASH });
        Storage.setCurrentUser({ ...user, paymentMethod: CONSTANTS.PAYMENT_METHODS.CASH });
        
        Modals.hide();
        Notifications.success('Способ оплаты сохранен');
        
        // Продолжаем оформление заказа
        setTimeout(() => {
            Cart.checkout();
        }, 300);
    },

    formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        input.value = value;
    },

    formatCardExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    },

    saveCard() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        const cardHolder = document.getElementById('cardHolder').value;

        if (!Utils.validateCard({
            number: cardNumber,
            expiry: cardExpiry,
            cvv: cardCvv,
            holder: cardHolder
        })) {
            Notifications.error('Проверьте правильность введенных данных');
            return;
        }

        const user = Storage.getCurrentUser();
        Storage.updateUser(user.id, { 
            paymentMethod: CONSTANTS.PAYMENT_METHODS.CARD,
            cardData: {
                lastFour: cardNumber.slice(-4),
                holder: cardHolder
            }
        });
        
        Storage.setCurrentUser({ 
            ...user, 
            paymentMethod: CONSTANTS.PAYMENT_METHODS.CARD 
        });
        
        Modals.hide();
        Notifications.success('Карта сохранена');
        
        // Продолжаем оформление заказа
        setTimeout(() => {
            Cart.checkout();
        }, 300);
    }
};