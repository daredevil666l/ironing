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

document.addEventListener("DOMContentLoaded", function () {
  const icons = document.querySelectorAll(".icon-animated");

  icons.forEach((icon) => {
    const staticImage = icon.dataset.static;
    const gifImage = icon.dataset.gif;

    // Устанавливаем CSS переменные
    icon.style.setProperty("--static-image", `url(${staticImage})`);
    icon.style.setProperty("--gif-image", `url(${gifImage})`);
  });
});

// Полный JavaScript код калькулятора стоимости глажки
class IroningCalculator {
  constructor() {
    this.selectedItems = [];
    this.currentMode = "detailed"; // новое свойство
    this.bulkSettings = {
      weight: 0,
      tariff: "single",
      urgency: "standard",
    };z

    // Исправленные тарифы без пересечений диапазонов
    this.pricingTiers = [
      { min: 1, max: 5, price: 1650, name: "неделька для одного" },
      { min: 6, max: 24, price: 1350, name: "неделька для двоих" },
      { min: 25, max: 10000, price: 1100, name: "неделька на всю семью" },
    ];

    this.urgencyMultipliers = {
      standard: { multiplier: 1, name: "Стандартный", time: "до 24 часов" },
      urgent: { multiplier: 1.5, name: "Срочный", time: "до 12 часов" },
      express: { multiplier: 2, name: "Экспресс", time: "до 2 часов" },
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.initModeSwitch(); // новый метод
    this.updateQuantityDisplay();
    this.updateCalculation();
  }

  // Новый метод для инициализации переключателя
  initModeSwitch() {
    const modeOptions = document.querySelectorAll(".mode-option");
    const background = document.querySelector(".mode-switcher__background");

    modeOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();

        const mode = option.dataset.mode;
        const radio = option.querySelector('input[type="radio"]');

        // Снимаем активность со всех опций
        modeOptions.forEach((opt) => {
          opt.classList.remove("mode-option--active");
        });

        // Активируем выбранную опцию
        option.classList.add("mode-option--active");
        radio.checked = true;

        // Анимация фона
        if (mode === "bulk") {
          background.classList.add("move-right");
        } else {
          background.classList.remove("move-right");
        }

        // Переключаем режим
        this.switchMode(mode);
      });
    });
  }

  // Метод переключения режимов
  switchMode(mode) {
    this.currentMode = mode;

    const detailedMode = document.querySelector(".calculator__form");
    const bulkMode = document.getElementById("bulkMode");

    if (mode === "bulk") {
      detailedMode.style.display = "none";
      bulkMode.style.display = "block";
      this.initBulkMode();
    } else {
      detailedMode.style.display = "block";
      bulkMode.style.display = "none";
      this.updateCalculation();
    }
  }
  // Инициализация упрощенного режима
  initBulkMode() {
    const weightInput = document.getElementById("bulkWeight");
    const urgencySelect = document.getElementById("bulkUrgencySelect");

    // Обработчик ввода веса
    if (weightInput) {
      weightInput.addEventListener("input", (e) => {
        this.bulkSettings.weight = parseFloat(e.target.value) || 0;
        this.autoSelectTariff();
        this.updateBulkCalculation();
      });
    }

    // Обработчик срочности
    if (urgencySelect) {
      urgencySelect.addEventListener("change", (e) => {
        this.bulkSettings.urgency = e.target.value;
        this.updateBulkCalculation();
      });
    }

    // Убираем все обработчики кликов для тарифов
    // Тарифы больше не кликабельны

    this.autoSelectTariff();
    this.updateBulkCalculation();
  }
  // Автоматический выбор тарифа по весу
  autoSelectTariff() {
    const weight = this.bulkSettings.weight;
    const tariffOptions = document.querySelectorAll(".tariff-option--info");
    let selectedTariff = "single";

    // Определяем тариф по весу
    if (weight >= 6 && weight <= 24) {
      selectedTariff = "couple";
    } else if (weight >= 25) {
      selectedTariff = "family";
    }

    // Обновляем визуальное состояние (убираем активность со всех)
    tariffOptions.forEach((option) => {
      option.classList.remove("tariff-option--active");
      if (option.dataset.tariff === selectedTariff) {
        option.classList.add("tariff-option--active");
      }
    });

    this.bulkSettings.tariff = selectedTariff;
  }
  // Расчет для упрощенного режима
  updateBulkCalculation() {
    const weight = this.bulkSettings.weight;
    const tariff = this.bulkSettings.tariff;
    const urgency = this.bulkSettings.urgency;

    if (weight === 0) {
      this.resetCalculation();
      return;
    }

    // Получаем тариф
    const tariffMap = {
      single: { price: 1650, name: "неделька для одного" },
      couple: { price: 1350, name: "неделька для двоих" },
      family: { price: 1100, name: "неделька на всю семью" },
    };

    const selectedTariff = tariffMap[tariff];
    const roundedWeight = Math.ceil(weight);
    const basePrice = roundedWeight * selectedTariff.price;

    // Расчет наценки за срочность
    const urgencyInfo = this.urgencyMultipliers[urgency];
    const urgencyPrice = basePrice * (urgencyInfo.multiplier - 1);
    const totalPrice = basePrice + urgencyPrice;

    // Обновляем отображение
    this.updateTariffDisplay(selectedTariff);

    const totalWeightElement = document.getElementById("totalWeight");
    if (totalWeightElement) {
      totalWeightElement.textContent = `${weight.toFixed(1)} кг`;
    }

    const basePriceElement = document.getElementById("basePrice");
    if (basePriceElement) {
      basePriceElement.textContent = `${roundedWeight} кг × ${selectedTariff.price.toFixed(
        2
      )} ₽ = ${this.formatPrice(basePrice)}`;
    }

    const totalPriceElement = document.getElementById("totalPrice");
    if (totalPriceElement) {
      totalPriceElement.textContent = this.formatPrice(totalPrice);
    }

    const deliveryTimeElement = document.getElementById("deliveryTime");
    if (deliveryTimeElement) {
      deliveryTimeElement.textContent = urgencyInfo.time;
    }

    // Обновляем строку наценки за срочность
    this.updateSurchargeRow(
      "urgencyRow",
      "urgencyPrice",
      urgencyPrice,
      urgency !== "standard"
    );

    // Обновляем информацию о доставке
    this.updateDeliveryInfo(totalPrice);
  }

  // Метод для обновления отображения тарифа
  updateTariffDisplay(tier) {
    const tariffPrice = document.getElementById("tariffPrice");
    const tariffDescription = document.getElementById("tariffDescription");
    const tariffInfo = document.getElementById("tariffInfo");

    if (tariffPrice && tariffDescription) {
      tariffPrice.textContent = `${tier.price.toFixed(2)} ₽/кг`;
      tariffDescription.textContent = `(${tier.name})`;
    }

    // Fallback для совместимости
    if (tariffInfo) {
      tariffInfo.textContent = `${tier.price.toFixed(2)} ₽/кг (${tier.name})`;
    }
  }

  bindEvents() {
    // Кнопка добавления вещи
    document.getElementById("addItemBtn").addEventListener("click", () => {
      this.addItem();
    });

    // Кнопка очистки всего
    document.getElementById("clearAllBtn").addEventListener("click", () => {
      this.clearAll();
    });

    // Слайдер количества
    document.getElementById("quantitySlider").addEventListener("input", (e) => {
      this.updateQuantityDisplay();
    });

    // Выбор срочности
    document.getElementById("urgencySelect").addEventListener("change", () => {
      this.updateCalculation();
    });

    // Enter в селекте для добавления
    document.getElementById("itemSelect").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addItem();
      }
    });
  }

  addItem() {
    const itemSelect = document.getElementById("itemSelect");
    const quantitySlider = document.getElementById("quantitySlider");

    if (!itemSelect.value) {
      this.showNotification("Пожалуйста, выберите тип изделия", "warning");
      return;
    }

    const [itemKey, weight] = itemSelect.value.split("|");
    const itemName = itemSelect.options[itemSelect.selectedIndex].text;
    const quantity = parseInt(quantitySlider.value);

    // Проверяем, есть ли уже такой элемент
    const existingItemIndex = this.selectedItems.findIndex(
      (item) => item.key === itemKey
    );

    if (existingItemIndex !== -1) {
      // Если есть, суммируем количество и пересчитываем вес
      this.selectedItems[existingItemIndex].quantity += quantity;
      this.selectedItems[existingItemIndex].totalWeight =
        (this.selectedItems[existingItemIndex].weight *
          this.selectedItems[existingItemIndex].quantity) /
        1000;
      this.showNotification(
        `Обновлено: ${itemName} (${this.selectedItems[existingItemIndex].quantity} шт.)`,
        "info"
      );
    } else {
      // Если нет, добавляем новый элемент
      const item = {
        id: Date.now(),
        key: itemKey,
        name: itemName,
        weight: parseInt(weight),
        quantity: quantity,
        totalWeight: (parseInt(weight) * quantity) / 1000, // Конвертируем в кг
      };
      this.selectedItems.push(item);
      this.showNotification(
        `Добавлено: ${itemName} (${quantity} шт.)`,
        "success"
      );
    }

    this.renderSelectedItems();
    this.updateCalculation();

    // Сброс формы
    itemSelect.value = "";
    quantitySlider.value = 1;
    this.updateQuantityDisplay();
  }

  removeItem(itemId) {
    // Находим элемент для удаления
    const itemToRemove = this.selectedItems.find((item) => item.id === itemId);

    if (!itemToRemove) {
      console.error("Элемент для удаления не найден");
      return;
    }

    // Удаляем элемент из массива
    this.selectedItems = this.selectedItems.filter(
      (item) => item.id !== itemId
    );

    // Обновляем отображение
    this.renderSelectedItems();
    this.updateCalculation();

    // Показываем уведомление
    this.showNotification(`Удалено: ${itemToRemove.name}`, "info");
  }
  renderSelectedItems() {
    const container = document.getElementById("selectedItems");

    if (!container) return;

    if (this.selectedItems.length === 0) {
      container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p class="empty-text">Добавьте вещи для расчета стоимости</p>
            </div>
        `;
      return;
    }

    container.innerHTML = this.selectedItems
      .map(
        (item) => `
        <div class="selected-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">${item.quantity} шт. × ${
          item.weight
        }г</div>
            </div>
            <div class="item-weight">${item.totalWeight.toFixed(2)} кг</div>
            <button class="remove-item" data-item-id="${
              item.id
            }" title="Удалить">×</button>
        </div>
    `
      )
      .join("");

    // Добавляем обработчики событий для кнопок удаления
    const removeButtons = container.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        this.removeItem(itemId);
      });
    });
  }

  updateQuantityDisplay() {
    const slider = document.getElementById("quantitySlider");
    const display = document.getElementById("quantityValue");
    display.textContent = slider.value;
  }

  updateCalculation() {
    if (this.currentMode === "bulk") {
      this.updateBulkCalculation();
      return;
    }

    // Существующий код для детального режима
    const totalWeight = this.calculateTotalWeight();
    const urgencySelect = document.getElementById("urgencySelect");

    if (!urgencySelect) return;

    const urgency = urgencySelect.value;

    // Обновляем отображение веса
    const totalWeightElement = document.getElementById("totalWeight");
    if (totalWeightElement) {
      totalWeightElement.textContent = `${totalWeight.toFixed(1)} кг`;
    }

    if (totalWeight === 0) {
      this.resetCalculation();
      return;
    }

    // Остальной код остается без изменений...
    const tier = this.getPricingTier(totalWeight);
    const roundedWeight = Math.ceil(totalWeight);
    const basePrice = roundedWeight * tier.price;

    const urgencyInfo = this.urgencyMultipliers[urgency];
    const urgencyPrice = basePrice * (urgencyInfo.multiplier - 1);
    const totalPrice = basePrice + urgencyPrice;

    this.updateTariffDisplay(tier);

    const basePriceElement = document.getElementById("basePrice");
    if (basePriceElement) {
      basePriceElement.textContent = `${roundedWeight} кг × ${tier.price.toFixed(
        2
      )} ₽ = ${this.formatPrice(basePrice)}`;
    }

    const totalPriceElement = document.getElementById("totalPrice");
    if (totalPriceElement) {
      totalPriceElement.textContent = this.formatPrice(totalPrice);
    }

    const deliveryTimeElement = document.getElementById("deliveryTime");
    if (deliveryTimeElement) {
      deliveryTimeElement.textContent = urgencyInfo.time;
    }

    this.updateSurchargeRow(
      "urgencyRow",
      "urgencyPrice",
      urgencyPrice,
      urgency !== "standard"
    );
    this.updateDeliveryInfo(totalPrice);
  }

  calculateTotalWeight() {
    return this.selectedItems.reduce(
      (total, item) => total + item.totalWeight,
      0
    );
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
      row.style.display = "flex";
      priceElement.textContent = `+${this.formatPrice(price)}`;
    } else {
      row.style.display = "none";
    }
  }

  updateDeliveryInfo(totalPrice) {
    const deliveryThreshold = 2990;
    const deliveryInfo = document.querySelector(".info-text");

    if (totalPrice >= deliveryThreshold) {
      deliveryInfo.innerHTML =
        "🚚 <strong>Доставка через сервис Яндекс</strong>";
      deliveryInfo.style.color = "var(--primary-color)";
    } else {
      const remaining = deliveryThreshold - totalPrice;
      deliveryInfo.innerHTML = `🚚 До бесплатной доставки: ${this.formatPrice(
        remaining
      )}`;
      deliveryInfo.style.color = "var(--text-secondary)";
    }
  }

  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  resetCalculation() {
    // Безопасное обновление элементов
    const elementsToReset = {
      tariffPrice: "-",
      tariffDescription: "-",
      tariffInfo: "-",
      basePrice: "0 ₽",
      totalPrice: "0 ₽",
      deliveryTime: "-",
    };

    Object.entries(elementsToReset).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    // Скрываем строку наценки
    const urgencyRow = document.getElementById("urgencyRow");
    if (urgencyRow) {
      urgencyRow.style.display = "none";
    }

    // Сброс информации о доставке
    const deliveryInfo = document.querySelector(".info-text");
    if (deliveryInfo) {
      deliveryInfo.innerHTML = "🚚 Доставка через сервис Яндекса";
      deliveryInfo.style.color = "var(--text-secondary)";
    }
  }

  clearAll() {
    this.selectedItems = [];
    this.renderSelectedItems();
    this.updateCalculation();

    // Сброс всех контролов
    document.getElementById("itemSelect").value = "";
    document.getElementById("quantitySlider").value = 1;
    document.getElementById("urgencySelect").value = "standard";

    this.updateQuantityDisplay();
    this.showNotification("Калькулятор очищен", "info");
  }

  // Система уведомлений
  showNotification(message, type = "info") {
    // Создаем элемент уведомления
    const notification = document.createElement("div");
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
      notification.classList.add("notification--show");
    }, 100);

    // Автоматическое закрытие
    const autoClose = setTimeout(() => {
      this.closeNotification(notification);
    }, 3000);

    // Закрытие по клику
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        clearTimeout(autoClose);
        this.closeNotification(notification);
      });
  }

  closeNotification(notification) {
    notification.classList.remove("notification--show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  addNotificationStyles() {
    if (!document.getElementById("notification-styles")) {
      const styles = document.createElement("style");
      styles.id = "notification-styles";
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
    const urgency = document.getElementById("urgencySelect").value;
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
        rounded: roundedWeight,
      },
      pricing: {
        tier: tier,
        basePrice: basePrice,
        urgencyPrice: urgencyPrice,
        totalPrice: totalPrice,
      },
      urgency: urgencyInfo,
      deliveryFree: totalPrice >= 2990,
    };
  }
}

// Инициализация калькулятора при загрузке DOM
document.addEventListener("DOMContentLoaded", function () {
  window.calculator = new IroningCalculator();

  // Добавляем глобальные обработчики для лучшего UX
  document.addEventListener("keydown", function (e) {
    // Escape для очистки
    if (e.key === "Escape") {
      const itemSelect = document.getElementById("itemSelect");
      if (itemSelect.value) {
        itemSelect.value = "";
      }
    }
  });

  // Предотвращаем отправку формы по Enter
  document.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
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
      errors:
        orderData.items.length === 0 ? ["Добавьте хотя бы одну вещь"] : [],
    };
  },

  // Получение текстового описания заказа
  getOrderSummary: (orderData) => {
    const itemsText = orderData.items
      .map((item) => `${item.name} (${item.quantity} шт.)`)
      .join(", ");

    return (
      `Заказ: ${itemsText}. Общий вес: ${orderData.weight.actual.toFixed(
        1
      )} кг. ` +
      `Срочность: ${
        orderData.urgency.name
      }. Стоимость: ${orderData.pricing.totalPrice.toFixed(0)} ₽`
    );
  },
};

// FAQ Interactive functionality
class FAQController {
  constructor() {
    this.faqItems = document.querySelectorAll(".faq-item");
    this.init();
  }

  init() {
    this.bindEvents();
    this.addKeyboardSupport();
  }

  bindEvents() {
    this.faqItems.forEach((item) => {
      const question = item.querySelector(".faq-item__question");

      question.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleItem(item);
      });

      // Hover effects
      question.addEventListener("mouseenter", () => {
        this.addHoverEffect(item);
      });

      question.addEventListener("mouseleave", () => {
        this.removeHoverEffect(item);
      });
    });
  }

  toggleItem(item) {
    const isActive = item.classList.contains("active");

    if (isActive) {
      this.closeItem(item);
    } else {
      // Опционально: закрываем другие открытые элементы
      // this.closeAllItems();
      this.openItem(item);
    }
  }

  openItem(item) {
    item.classList.add("active");

    const answer = item.querySelector(".faq-item__answer");
    const content = item.querySelector(".answer-content");

    // Плавная анимация открытия
    answer.style.maxHeight = content.scrollHeight + 40 + "px";

    // Анимация иконки
    this.animateIcon(item, true);

    // Scroll to item if needed
    setTimeout(() => {
      this.scrollToItem(item);
    }, 300);
  }

  closeItem(item) {
    item.classList.remove("active");

    const answer = item.querySelector(".faq-item__answer");
    answer.style.maxHeight = "0px";

    // Анимация иконки
    this.animateIcon(item, false);
  }

  closeAllItems() {
    this.faqItems.forEach((item) => {
      if (item.classList.contains("active")) {
        this.closeItem(item);
      }
    });
  }

  animateIcon(item, isOpening) {
    const icon = item.querySelector(".question-icon");

    if (isOpening) {
      icon.style.transform = "rotate(45deg) scale(1.1)";
    } else {
      icon.style.transform = "rotate(0deg) scale(1)";
    }

    setTimeout(() => {
      icon.style.transform = isOpening
        ? "rotate(45deg) scale(1)"
        : "rotate(0deg) scale(1)";
    }, 150);
  }

  addHoverEffect(item) {
    const icon = item.querySelector(".question-icon");
    if (!item.classList.contains("active")) {
      icon.style.transform = "scale(1.05)";
    }
  }

  removeHoverEffect(item) {
    const icon = item.querySelector(".question-icon");
    if (!item.classList.contains("active")) {
      icon.style.transform = "scale(1)";
    }
  }

  scrollToItem(item) {
    const itemRect = item.getBoundingClientRect();
    const isVisible =
      itemRect.top >= 0 && itemRect.bottom <= window.innerHeight;

    if (!isVisible) {
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }

  addKeyboardSupport() {
    this.faqItems.forEach((item, index) => {
      const question = item.querySelector(".faq-item__question");
      question.setAttribute("tabindex", "0");
      question.setAttribute("role", "button");
      question.setAttribute("aria-expanded", "false");

      question.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleItem(item);
        }

        // Навигация стрелками
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.focusNextItem(index);
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          this.focusPrevItem(index);
        }
      });

      // Обновляем aria-expanded при изменении состояния
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            const isActive = item.classList.contains("active");
            question.setAttribute("aria-expanded", isActive.toString());
          }
        });
      });

      observer.observe(item, { attributes: true });
    });
  }

  focusNextItem(currentIndex) {
    const nextIndex = (currentIndex + 1) % this.faqItems.length;
    const nextQuestion = this.faqItems[nextIndex].querySelector(
      ".faq-item__question"
    );
    nextQuestion.focus();
  }

  focusPrevItem(currentIndex) {
    const prevIndex =
      currentIndex === 0 ? this.faqItems.length - 1 : currentIndex - 1;
    const prevQuestion = this.faqItems[prevIndex].querySelector(
      ".faq-item__question"
    );
    prevQuestion.focus();
  }

  // Метод для программного управления
  openItemById(itemId) {
    const item = document.querySelector(`[data-faq="${itemId}"]`);
    if (item && !item.classList.contains("active")) {
      this.openItem(item);
    }
  }

  // Поиск по вопросам
  searchFAQ(searchTerm) {
    const results = [];

    this.faqItems.forEach((item, index) => {
      const question = item
        .querySelector(".question-text")
        .textContent.toLowerCase();
      const answer = item
        .querySelector(".answer-content p")
        .textContent.toLowerCase();
      const term = searchTerm.toLowerCase();

      if (question.includes(term) || answer.includes(term)) {
        results.push({
          index: index,
          item: item,
          question: item.querySelector(".question-text").textContent,
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
  },
};

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", function () {
  window.faqController = new FAQController();

  // Smooth scroll для ссылок на FAQ
  document.addEventListener("click", function (e) {
    if (e.target.matches('a[href^="#faq"]')) {
      e.preventDefault();
      const targetId = e.target.getAttribute("href").substring(4);
      window.FAQUtils.openQuestion(targetId);
    }
  });

  // Автоматическое открытие при переходе по якорной ссылке
  if (window.location.hash && window.location.hash.startsWith("#faq")) {
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
    this.sections = document.querySelectorAll("section[id]");
    this.headerHeight = 100; // Высота sticky хедера

    this.init();
  }

  init() {
    this.bindScrollEvents();
    this.bindClickEvents();
    this.updateActiveLink();
  }

  bindClickEvents() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        this.scrollToSection(targetId);

        // Закрываем мобильное меню при клике
        this.closeMobileMenu();
      });
    });
  }

  bindScrollEvents() {
    let ticking = false;

    window.addEventListener("scroll", () => {
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

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.id;
      }
    });

    // Обновляем активные ссылки
    this.navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href").substring(1);

      if (linkTarget === currentSection) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById("headerNav");
    const menuToggle = document.getElementById("mobileMenuToggle");

    if (mobileMenu && menuToggle) {
      mobileMenu.classList.remove("nav-open");
      menuToggle.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
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
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  window.smoothScrollNav = new SmoothScrollNavigation();

  // Обработка якорных ссылок при загрузке страницы
  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.substring(1);
      window.smoothScrollNav.scrollToSection(targetId);
    }, 100);
  }

  // Обработка изменения размера окна
  window.addEventListener("resize", () => {
    window.smoothScrollNav.headerHeight =
      document.querySelector(".header").offsetHeight;
  });
});

// Поддержка для старых браузеров без scroll-behavior
if (!("scrollBehavior" in document.documentElement.style)) {
  // Полифил для плавного скролла
  document.documentElement.style.scrollBehavior = "auto";
}

// Simplified Page Loader
class SimplePageLoader {
  constructor() {
    this.loaderScreen = document.getElementById("loaderScreen");
    this.progressFill = document.getElementById("progressFill");
    this.progressPercent = document.getElementById("progressPercent");

    this.totalResources = 0;
    this.loadedResources = 0;
    this.minLoadTime = 1500; // Минимальное время показа
    this.startTime = Date.now();

    this.init();
  }

  init() {
    this.showLoader();
    this.countResources();
    this.startLoading();
    this.bindEvents();
  }

  showLoader() {
    this.loaderScreen.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  hideLoader() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minLoadTime - elapsedTime);

    setTimeout(() => {
      this.loaderScreen.classList.add("hidden");
      document.body.style.overflow = "";

      // Удаляем элемент из DOM после анимации
      setTimeout(() => {
        if (this.loaderScreen.parentNode) {
          this.loaderScreen.parentNode.removeChild(this.loaderScreen);
        }
      }, 600);
    }, remainingTime);
  }

  countResources() {
    // Считаем все ресурсы на странице
    const images = document.querySelectorAll("img");
    const videos = document.querySelectorAll("video");
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    const scripts = document.querySelectorAll("script[src]");

    this.totalResources =
      images.length + videos.length + links.length + scripts.length + 3;
  }

  startLoading() {
    this.trackResources();
    this.simulateProgress();
  }

  simulateProgress() {
    // Плавная анимация прогресса для лучшего UX
    let progress = 0;
    const animate = () => {
      progress += Math.random() * 3;

      if (progress < 90) {
        this.updateProgress(Math.min(progress, 90));
        setTimeout(animate, 100 + Math.random() * 200);
      }
    };

    animate();
  }

  trackResources() {
    // Отслеживаем загрузку изображений
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (img.complete) {
        this.onResourceLoaded();
      } else {
        img.addEventListener("load", () => this.onResourceLoaded());
        img.addEventListener("error", () => this.onResourceLoaded());
      }
    });

    // Отслеживаем загрузку видео
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video.readyState >= 3) {
        this.onResourceLoaded();
      } else {
        video.addEventListener("canplaythrough", () => this.onResourceLoaded());
        video.addEventListener("error", () => this.onResourceLoaded());
      }
    });

    // Отслеживаем загрузку CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      if (link.sheet) {
        this.onResourceLoaded();
      } else {
        link.addEventListener("load", () => this.onResourceLoaded());
        link.addEventListener("error", () => this.onResourceLoaded());
      }
    });

    // Отслеживаем загрузку скриптов
    const scripts = document.querySelectorAll("script[src]");
    scripts.forEach((script) => {
      script.addEventListener("load", () => this.onResourceLoaded());
      script.addEventListener("error", () => this.onResourceLoaded());
    });

    // Проверяем готовность страницы
    if (document.readyState === "complete") {
      setTimeout(() => this.finalizeLoading(), 500);
    } else {
      window.addEventListener("load", () => {
        setTimeout(() => this.finalizeLoading(), 500);
      });
    }
  }

  onResourceLoaded() {
    this.loadedResources++;
    const realProgress = Math.min(
      95,
      (this.loadedResources / this.totalResources) * 100
    );

    // Обновляем прогресс только если он больше текущего
    const currentProgress = parseInt(this.progressPercent.textContent);
    if (realProgress > currentProgress) {
      this.updateProgress(realProgress);
    }
  }

  finalizeLoading() {
    // Завершаем загрузку на 100%
    this.updateProgress(100);

    setTimeout(() => {
      this.hideLoader();
    }, 300);
  }

  updateProgress(percent) {
    const roundedPercent = Math.round(percent);
    this.progressPercent.textContent = roundedPercent + "%";
    this.progressFill.style.width = percent + "%";
  }

  bindEvents() {
    // Обработка ошибок загрузки
    window.addEventListener("error", (e) => {
      this.onResourceLoaded(); // Считаем как загруженный
    });

    // Клавиша Escape для принудительного скрытия (для отладки)
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        !this.loaderScreen.classList.contains("hidden")
      ) {
        this.hideLoader();
      }
    });
  }
}

// Инициализация загрузчика
document.addEventListener("DOMContentLoaded", function () {
  window.pageLoader = new SimplePageLoader();
});

// Таймаут безопасности
setTimeout(() => {
  const loader = document.getElementById("loaderScreen");
  if (loader && !loader.classList.contains("hidden")) {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
  }
}, 8000);
