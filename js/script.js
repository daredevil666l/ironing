document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const headerNav = document.getElementById("headerNav");

  mobileMenuToggle.addEventListener("click", function () {
    headerNav.classList.toggle("nav-open");
    mobileMenuToggle.classList.toggle("menu-open");
    document.body.classList.toggle("menu-open");
  });

  // Закрытие меню при клике на ссылку
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      headerNav.classList.remove("nav-open");
      mobileMenuToggle.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
    });
  });

  // Закрытие меню при клике вне его
  document.addEventListener("click", function (e) {
    if (!headerNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      headerNav.classList.remove("nav-open");
      mobileMenuToggle.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.icon-animated');
    
    icons.forEach(icon => {
        const staticImage = icon.dataset.static;
        const gifImage = icon.dataset.gif;
        
        // Устанавливаем CSS переменные
        icon.style.setProperty('--static-image', `url(${staticImage})`);
        icon.style.setProperty('--gif-image', `url(${gifImage})`);
    });
});


// Полный JavaScript код калькулятора стоимости глажки
class IroningCalculator {
    constructor() {
        this.selectedItems = [];
        
        // Исправленные тарифы без пересечений диапазонов
        this.pricingTiers = [
            { min: 1, max: 5, price: 1636.90, name: "неделька для одного" },
            { min: 6, max: 24, price: 1364.09, name: "неделька для двоих" },
            { min: 25, max: 10000, price: 1091.27, name: "неделька на всю семью" }
        ];
        
        this.urgencyMultipliers = {
            standard: { multiplier: 1, name: "Стандартный", time: "до 24 часов" },
            urgent: { multiplier: 1.5, name: "Срочный", time: "до 12 часов" },
            express: { multiplier: 2, name: "Экспресс", time: "до 2 часов" }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateQuantityDisplay();
        this.updateCalculation();
    }
    
    bindEvents() {
        // Кнопка добавления вещи
        document.getElementById('addItemBtn').addEventListener('click', () => {
            this.addItem();
        });
        
        // Кнопка очистки всего
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAll();
        });
        
        // Слайдер количества
        document.getElementById('quantitySlider').addEventListener('input', (e) => {
            this.updateQuantityDisplay();
        });
        
        // Выбор срочности
        document.getElementById('urgencySelect').addEventListener('change', () => {
            this.updateCalculation();
        });
        
        // Enter в селекте для добавления
        document.getElementById('itemSelect').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
    }
    
    addItem() {
        const itemSelect = document.getElementById('itemSelect');
        const quantitySlider = document.getElementById('quantitySlider');
        
        if (!itemSelect.value) {
            this.showNotification('Пожалуйста, выберите тип изделия', 'warning');
            return;
        }
        
        const [itemKey, weight] = itemSelect.value.split('|');
        const itemName = itemSelect.options[itemSelect.selectedIndex].text;
        const quantity = parseInt(quantitySlider.value);
        
        const item = {
            id: Date.now(),
            key: itemKey,
            name: itemName,
            weight: parseInt(weight),
            quantity: quantity,
            totalWeight: (parseInt(weight) * quantity) / 1000 // Конвертируем в кг
        };
        
        this.selectedItems.push(item);
        this.renderSelectedItems();
        this.updateCalculation();
        
        // Сброс формы
        itemSelect.value = '';
        quantitySlider.value = 1;
        this.updateQuantityDisplay();
        
        this.showNotification(`Добавлено: ${item.name} (${item.quantity} шт.)`, 'success');
    }
    
    removeItem(itemId) {
        const itemToRemove = this.selectedItems.find(item => item.id === itemId);
        this.selectedItems = this.selectedItems.filter(item => item.id !== itemId);
        this.renderSelectedItems();
        this.updateCalculation();
        
        if (itemToRemove) {
            this.showNotification(`Удалено: ${itemToRemove.name}`, 'info');
        }
    }
    
    renderSelectedItems() {
        const container = document.getElementById('selectedItems');
        
        if (this.selectedItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p class="empty-text">Добавьте вещи для расчета стоимости</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.selectedItems.map(item => `
            <div class="selected-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">${item.quantity} шт. × ${item.weight}г</div>
                </div>
                <div class="item-weight">${item.totalWeight.toFixed(2)} кг</div>
                <button class="remove-item" onclick="calculator.removeItem(${item.id})" title="Удалить">×</button>
            </div>
        `).join('');
    }
    
    updateQuantityDisplay() {
        const slider = document.getElementById('quantitySlider');
        const display = document.getElementById('quantityValue');
        display.textContent = slider.value;
    }
    
    updateCalculation() {
        const totalWeight = this.calculateTotalWeight();
        const urgency = document.getElementById('urgencySelect').value;
        
        // Обновляем отображение веса
        document.getElementById('totalWeight').textContent = `${totalWeight.toFixed(1)} кг`;
        
        if (totalWeight === 0) {
            this.resetCalculation();
            return;
        }
        
        // Расчет базовой цены с правильным округлением
        const tier = this.getPricingTier(totalWeight);
        const roundedWeight = Math.ceil(totalWeight); // Округление вверх до целого килограмма
        const basePrice = roundedWeight * tier.price;
        
        // Расчет наценки за срочность
        const urgencyInfo = this.urgencyMultipliers[urgency];
        const urgencyPrice = basePrice * (urgencyInfo.multiplier - 1);
        
        // Общий расчет
        const totalPrice = basePrice + urgencyPrice;
        
        // Обновляем отображение
        document.getElementById('tariffInfo').textContent = 
            `${tier.price.toFixed(2)} ₽/кг (${tier.name})`;
        document.getElementById('basePrice').textContent = 
            `${roundedWeight} кг × ${tier.price.toFixed(2)} ₽ = ${this.formatPrice(basePrice)}`;
        document.getElementById('totalPrice').textContent = this.formatPrice(totalPrice);
        document.getElementById('deliveryTime').textContent = urgencyInfo.time;
        
        // Обновляем строку наценки за срочность
        this.updateSurchargeRow('urgencyRow', 'urgencyPrice', urgencyPrice, urgency !== 'standard');
        
        // Обновляем информацию о бесплатной доставке
        this.updateDeliveryInfo(totalPrice);
    }
    
    calculateTotalWeight() {
        return this.selectedItems.reduce((total, item) => total + item.totalWeight, 0);
    }
    
    // Исправленная логика выбора тарифа
    getPricingTier(weight) {
        // Округляем вес вверх до целого килограмма
        const roundedWeight = Math.ceil(weight);
        
        // Находим подходящий тариф по весу
        for (const tier of this.pricingTiers) {
            if (roundedWeight >= tier.min && roundedWeight <= tier.max) {
                return tier;
            }
        }
        
        // Если не найден подходящий тариф, возвращаем самый дорогой
        return this.pricingTiers[0];
    }
    
    updateSurchargeRow(rowId, priceId, price, show) {
        const row = document.getElementById(rowId);
        const priceElement = document.getElementById(priceId);
        
        if (show && price > 0) {
            row.style.display = 'flex';
            priceElement.textContent = `+${this.formatPrice(price)}`;
        } else {
            row.style.display = 'none';
        }
    }
    
    updateDeliveryInfo(totalPrice) {
        const deliveryThreshold = 2990;
        const deliveryInfo = document.querySelector('.info-text');
        
        if (totalPrice >= deliveryThreshold) {
            deliveryInfo.innerHTML = '🚚 <strong>Бесплатная доставка включена!</strong>';
            deliveryInfo.style.color = 'var(--primary-color)';
        } else {
            const remaining = deliveryThreshold - totalPrice;
            deliveryInfo.innerHTML = `🚚 До бесплатной доставки: ${this.formatPrice(remaining)}`;
            deliveryInfo.style.color = 'var(--text-secondary)';
        }
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
    
    resetCalculation() {
        document.getElementById('tariffInfo').textContent = '-';
        document.getElementById('basePrice').textContent = '0 ₽';
        document.getElementById('totalPrice').textContent = '0 ₽';
        document.getElementById('deliveryTime').textContent = '-';
        document.getElementById('urgencyRow').style.display = 'none';
        
        // Сброс информации о доставке
        const deliveryInfo = document.querySelector('.info-text');
        deliveryInfo.innerHTML = '🚚 Бесплатная доставка от 2990₽';
        deliveryInfo.style.color = 'var(--text-secondary)';
    }
    
    clearAll() {
        this.selectedItems = [];
        this.renderSelectedItems();
        this.updateCalculation();
        
        // Сброс всех контролов
        document.getElementById('itemSelect').value = '';
        document.getElementById('quantitySlider').value = 1;
        document.getElementById('urgencySelect').value = 'standard';
        
        this.updateQuantityDisplay();
        this.showNotification('Калькулятор очищен', 'info');
    }
    
    // Система уведомлений
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification-text">${message}</span>
            <button class="notification-close">×</button>
        `;
        
        // Добавляем стили для уведомлений
        this.addNotificationStyles();
        
        // Добавляем в DOM
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);
        
        // Автоматическое закрытие
        const autoClose = setTimeout(() => {
            this.closeNotification(notification);
        }, 3000);
        
        // Закрытие по клику
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeNotification(notification);
        });
    }
    
    closeNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 300px;
                    padding: 16px 20px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                
                .notification--show {
                    transform: translateX(0);
                }
                
                .notification--success {
                    border-left: 4px solid #27ae60;
                }
                
                .notification--warning {
                    border-left: 4px solid #f39c12;
                }
                
                .notification--info {
                    border-left: 4px solid var(--primary-color);
                }
                
                .notification-text {
                    flex: 1;
                    font-family: var(--font-nav);
                    font-size: 14px;
                    color: var(--text-primary);
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification-close:hover {
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // Метод для экспорта данных заказа (для интеграции с формой заказа)
    getOrderData() {
        const totalWeight = this.calculateTotalWeight();
        const urgency = document.getElementById('urgencySelect').value;
        const tier = this.getPricingTier(totalWeight);
        const roundedWeight = Math.ceil(totalWeight);
        const basePrice = roundedWeight * tier.price;
        const urgencyInfo = this.urgencyMultipliers[urgency];
        const urgencyPrice = basePrice * (urgencyInfo.multiplier - 1);
        const totalPrice = basePrice + urgencyPrice;
        
        return {
            items: this.selectedItems,
            weight: {
                actual: totalWeight,
                rounded: roundedWeight
            },
            pricing: {
                tier: tier,
                basePrice: basePrice,
                urgencyPrice: urgencyPrice,
                totalPrice: totalPrice
            },
            urgency: urgencyInfo,
            deliveryFree: totalPrice >= 2990
        };
    }
}

// Инициализация калькулятора при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    window.calculator = new IroningCalculator();
    
    // Добавляем глобальные обработчики для лучшего UX
    document.addEventListener('keydown', function(e) {
        // Escape для очистки
        if (e.key === 'Escape') {
            const itemSelect = document.getElementById('itemSelect');
            if (itemSelect.value) {
                itemSelect.value = '';
            }
        }
    });
    
    // Предотвращаем отправку формы по Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
        }
    });
});

// Дополнительные утилиты для интеграции
window.IroningCalculatorUtils = {
    // Форматирование веса
    formatWeight: (weight) => {
        return `${weight.toFixed(1)} кг`;
    },
    
    // Валидация данных заказа
    validateOrder: (orderData) => {
        return {
            isValid: orderData.items.length > 0 && orderData.weight.actual > 0,
            errors: orderData.items.length === 0 ? ['Добавьте хотя бы одну вещь'] : []
        };
    },
    
    // Получение текстового описания заказа
    getOrderSummary: (orderData) => {
        const itemsText = orderData.items.map(item => 
            `${item.name} (${item.quantity} шт.)`
        ).join(', ');
        
        return `Заказ: ${itemsText}. Общий вес: ${orderData.weight.actual.toFixed(1)} кг. ` +
               `Срочность: ${orderData.urgency.name}. Стоимость: ${orderData.pricing.totalPrice.toFixed(0)} ₽`;
    }
};


// FAQ Interactive functionality
class FAQController {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.addKeyboardSupport();
    }
    
    bindEvents() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-item__question');
            
            question.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleItem(item);
            });
            
            // Hover effects
            question.addEventListener('mouseenter', () => {
                this.addHoverEffect(item);
            });
            
            question.addEventListener('mouseleave', () => {
                this.removeHoverEffect(item);
            });
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        if (isActive) {
            this.closeItem(item);
        } else {
            // Опционально: закрываем другие открытые элементы
            // this.closeAllItems();
            this.openItem(item);
        }
    }
    
    openItem(item) {
        item.classList.add('active');
        
        const answer = item.querySelector('.faq-item__answer');
        const content = item.querySelector('.answer-content');
        
        // Плавная анимация открытия
        answer.style.maxHeight = content.scrollHeight + 40 + 'px';
        
        // Анимация иконки
        this.animateIcon(item, true);
        
        // Scroll to item if needed
        setTimeout(() => {
            this.scrollToItem(item);
        }, 300);
    }
    
    closeItem(item) {
        item.classList.remove('active');
        
        const answer = item.querySelector('.faq-item__answer');
        answer.style.maxHeight = '0px';
        
        // Анимация иконки
        this.animateIcon(item, false);
    }
    
    closeAllItems() {
        this.faqItems.forEach(item => {
            if (item.classList.contains('active')) {
                this.closeItem(item);
            }
        });
    }
    
    animateIcon(item, isOpening) {
        const icon = item.querySelector('.question-icon');
        
        if (isOpening) {
            icon.style.transform = 'rotate(45deg) scale(1.1)';
        } else {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
        
        setTimeout(() => {
            icon.style.transform = isOpening ? 'rotate(45deg) scale(1)' : 'rotate(0deg) scale(1)';
        }, 150);
    }
    
    addHoverEffect(item) {
        const icon = item.querySelector('.question-icon');
        if (!item.classList.contains('active')) {
            icon.style.transform = 'scale(1.05)';
        }
    }
    
    removeHoverEffect(item) {
        const icon = item.querySelector('.question-icon');
        if (!item.classList.contains('active')) {
            icon.style.transform = 'scale(1)';
        }
    }
    
    scrollToItem(item) {
        const itemRect = item.getBoundingClientRect();
        const isVisible = itemRect.top >= 0 && itemRect.bottom <= window.innerHeight;
        
        if (!isVisible) {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
    
    addKeyboardSupport() {
        this.faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-item__question');
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(item);
                }
                
                // Навигация стрелками
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusNextItem(index);
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.focusPrevItem(index);
                }
            });
            
            // Обновляем aria-expanded при изменении состояния
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isActive = item.classList.contains('active');
                        question.setAttribute('aria-expanded', isActive.toString());
                    }
                });
            });
            
            observer.observe(item, { attributes: true });
        });
    }
    
    focusNextItem(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.faqItems.length;
        const nextQuestion = this.faqItems[nextIndex].querySelector('.faq-item__question');
        nextQuestion.focus();
    }
    
    focusPrevItem(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.faqItems.length - 1 : currentIndex - 1;
        const prevQuestion = this.faqItems[prevIndex].querySelector('.faq-item__question');
        prevQuestion.focus();
    }
    
    // Метод для программного управления
    openItemById(itemId) {
        const item = document.querySelector(`[data-faq="${itemId}"]`);
        if (item && !item.classList.contains('active')) {
            this.openItem(item);
        }
    }
    
    // Поиск по вопросам
    searchFAQ(searchTerm) {
        const results = [];
        
        this.faqItems.forEach((item, index) => {
            const question = item.querySelector('.question-text').textContent.toLowerCase();
            const answer = item.querySelector('.answer-content p').textContent.toLowerCase();
            const term = searchTerm.toLowerCase();
            
            if (question.includes(term) || answer.includes(term)) {
                results.push({
                    index: index,
                    item: item,
                    question: item.querySelector('.question-text').textContent
                });
            }
        });
        
        return results;
    }
}

// Utility functions
window.FAQUtils = {
    // Открыть конкретный вопрос по ID
    openQuestion: (itemId) => {
        if (window.faqController) {
            window.faqController.openItemById(itemId);
        }
    },
    
    // Закрыть все вопросы
    closeAll: () => {
        if (window.faqController) {
            window.faqController.closeAllItems();
        }
    },
    
    // Поиск по FAQ
    search: (term) => {
        if (window.faqController) {
            return window.faqController.searchFAQ(term);
        }
        return [];
    }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    window.faqController = new FAQController();
    
    // Smooth scroll для ссылок на FAQ
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#faq"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(4);
            window.FAQUtils.openQuestion(targetId);
        }
    });
    
    // Автоматическое открытие при переходе по якорной ссылке
    if (window.location.hash && window.location.hash.startsWith('#faq')) {
        const itemId = window.location.hash.substring(4);
        setTimeout(() => {
            window.FAQUtils.openQuestion(itemId);
        }, 500);
    }
});




// Система плавного скролла и активных ссылок
class SmoothScrollNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        this.headerHeight = 100; // Высота sticky хедера
        
        this.init();
    }
    
    init() {
        this.bindScrollEvents();
        this.bindClickEvents();
        this.updateActiveLink();
    }
    
    bindClickEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Закрываем мобильное меню при клике
                this.closeMobileMenu();
            });
        });
    }
    
    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - this.headerHeight;
            
            // Плавный скролл с улучшенной анимацией
            this.smoothScrollTo(offsetTop, 800);
        }
    }
    
    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easedProgress = easeInOutQuad(progress);
            const currentPosition = startPosition + distance * easedProgress;
            
            window.scrollTo(0, currentPosition);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    updateActiveLink() {
        const scrollPosition = window.pageYOffset + this.headerHeight + 50;
        
        // Находим текущую активную секцию
        let currentSection = null;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Обновляем активные ссылки
        this.navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            
            if (linkTarget === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    closeMobileMenu() {
        const mobileMenu = document.getElementById('headerNav');
        const menuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && menuToggle) {
            mobileMenu.classList.remove('nav-open');
            menuToggle.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Метод для программного скролла к секции
    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - this.headerHeight;
            this.smoothScrollTo(offsetTop, 800);
        }
    }
}

// Дополнительные утилиты
window.ScrollUtils = {
    // Скролл к секции с внешних ссылок
    scrollTo: (sectionId) => {
        if (window.smoothScrollNav) {
            window.smoothScrollNav.scrollToSection(sectionId);
        }
    },
    
    // Проверка видимости секции
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.smoothScrollNav = new SmoothScrollNavigation();
    
    // Обработка якорных ссылок при загрузке страницы
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            window.smoothScrollNav.scrollToSection(targetId);
        }, 100);
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        window.smoothScrollNav.headerHeight = 
            document.querySelector('.header').offsetHeight;
    });
});


// Поддержка для старых браузеров без scroll-behavior
if (!('scrollBehavior' in document.documentElement.style)) {
    // Полифил для плавного скролла
    document.documentElement.style.scrollBehavior = 'auto';
}


