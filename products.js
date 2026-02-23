// js/modules/products.js
const Products = {
    add() {
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const category = document.getElementById('productCategory').value;
        const description = document.getElementById('productDescription').value;
        const images = [];

        // Собираем загруженные изображения
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`productImage${i}`);
            if (input && input.files[0]) {
                // В реальном проекте здесь нужно конвертировать в base64
                // Для простоты используем placeholder
                images.push('assets/default-product.png');
            }
        }

        if (!name || !price || !category || !description) {
            Notifications.error('Заполните все поля');
            return;
        }

        const product = {
            id: Utils.generateId(),
            name,
            price: parseInt(price),
            category,
            description,
            images: images.length > 0 ? images : ['assets/default-product.png'],
            createdAt: new Date().toISOString()
        };

        Storage.addProduct(product);
        Modals.hide();
        Notifications.success('Товар добавлен');
        Admin.renderProducts();
    },

    delete(productId) {
        if (confirm('Вы уверены, что хотите удалить товар?')) {
            Storage.deleteProduct(productId);
            Notifications.success('Товар удален');
            Admin.renderProducts();
        }
    },

    edit(productId) {
        const product = Storage.getItem(CONSTANTS.STORAGE_KEYS.PRODUCTS).find(p => p.id === productId);
        if (product) {
            Modals.show('adminProduct', product);
        }
    },

    update() {
        const id = document.getElementById('editProductId').value;
        const name = document.getElementById('editProductName').value;
        const price = document.getElementById('editProductPrice').value;
        const category = document.getElementById('editProductCategory').value;
        const description = document.getElementById('editProductDescription').value;

        const updates = { name, price: parseInt(price), category, description };
        Storage.updateProduct(id, updates);
        
        Modals.hide();
        Notifications.success('Товар обновлен');
        Admin.renderProducts();
    }
};