class CabinetManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupDataAttributes();
    }

    bindEvents() {
        // Обработка кликов по кнопкам
        document.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            if (action) {
                this.handleAction(action, e.target);
            }
        });
    }

    handleAction(action, element) {
        switch (action) {
            case 'use-bonus':
                this.handleUseBonus();
                break;
            case 'view-details':
                this.handleViewDetails();
                break;
            case 'order-history':
                this.handleOrderHistory();
                break;
        }
    }

    handleUseBonus() {
        console.log('Использовать бонусы');
        // Здесь будет интеграция с бекендом
    }

    handleViewDetails() {
        console.log('Посмотреть детали заказов');
        // Здесь будет интеграция с бекендом
    }

    handleOrderHistory() {
        console.log('Открыть историю заказов');
        // Здесь будет интеграция с бекендом
    }

    setupDataAttributes() {
        // Подготовка для PHP интеграции
        this.dataElements = {
            userName: document.querySelector('[data-user-name]'),
            bonusAmount: document.querySelector('[data-bonus-amount]'),
            bonusExpiry: document.querySelector('[data-bonus-expiry]'),
            activeOrders: document.querySelector('[data-active-orders]'),
            completedOrders: document.querySelector('[data-completed-orders]'),
            nextOrder: document.querySelector('[data-next-order]'),
            lastOrder: document.querySelector('[data-last-order]'),
            deliveryTime: document.querySelector('[data-delivery-time]')
        };
    }

    // Методы для обновления данных (для будущей PHP интеграции)
    updateUserData(data) {
        if (data.name && this.dataElements.userName) {
            this.dataElements.userName.textContent = data.name;
        }
        if (data.bonusAmount && this.dataElements.bonusAmount) {
            this.dataElements.bonusAmount.textContent = data.bonusAmount;
        }
        // Добавить остальные поля...
    }

    showLoading(element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }

    hideLoading(element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CabinetManager();
});
