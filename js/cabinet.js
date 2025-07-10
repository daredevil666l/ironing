// Система авторизации и управления личным кабинетом
class PersonalCabinet {
    constructor() {
        this.isAuthenticated = false;
        this.userPhone = '';
        this.currentStep = 'phone'; // phone, sms, authenticated
        this.resendTimer = null;
        this.resendSeconds = 60;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.checkAuth();
    }
    
    bindElements() {
        // Loader и основной контент
        this.loader = document.getElementById('pageLoader');
        this.cabinetContent = document.getElementById('cabinetContent');
        
        // Модальные окна
        this.modalOverlay = document.getElementById('modalOverlay');
        this.phoneModal = document.getElementById('phoneModal');
        this.smsModal = document.getElementById('smsModal');
        
        // Формы
        this.phoneForm = document.getElementById('phoneForm');
        this.smsForm = document.getElementById('smsForm');
        this.phoneInput = document.getElementById('phoneInput');
        this.smsDigits = document.querySelectorAll('.sms-digit');
        
        // Кнопки
        this.sendSmsBtn = document.getElementById('sendSmsBtn');
        this.verifySmsBtn = document.getElementById('verifySmsBtn');
        this.resendBtn = document.getElementById('resendBtn');
        this.changePhoneBtn = document.getElementById('changePhoneBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Отображение данных
        this.phoneDisplay = document.getElementById('phoneDisplay');
        this.userPhoneDisplay = document.getElementById('userPhone');
        this.timer = document.getElementById('timer');
        
        // Ошибки
        this.phoneError = document.getElementById('phoneError');
        this.smsError = document.getElementById('smsError');
    }
    
    bindEvents() {
        // Отправка SMS
        this.phoneForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendSMS();
        });
        
        // Проверка SMS-кода
        this.smsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.verifySMS();
        });
        
        // Обработка ввода телефона
        this.phoneInput.addEventListener('input', (e) => {
            this.formatPhone(e);
            this.clearError('phone');
        });
        
        // Обработка ввода SMS-кода
        this.smsDigits.forEach((digit, index) => {
            digit.addEventListener('input', (e) => {
                this.handleSMSInput(e, index);
            });
            
            digit.addEventListener('keydown', (e) => {
                this.handleSMSKeydown(e, index);
            });
            
            digit.addEventListener('paste', (e) => {
                this.handleSMSPaste(e);
            });
        });
        
        // Дополнительные кнопки
        this.resendBtn.addEventListener('click', () => {
            this.resendSMS();
        });
        
        this.changePhoneBtn.addEventListener('click', () => {
            this.backToPhone();
        });
        
        this.logoutBtn.addEventListener('click', () => {
            this.logout();
        });
        
        // Закрытие по клику на overlay
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                // Не позволяем закрыть модальное окно
                return false;
            }
        });
        
        // Блокируем ESC для закрытия модального окна
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.isAuthenticated) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    async checkAuth() {
        // Имитация проверки авторизации
        await this.delay(1500);
        
        // Проверяем localStorage на наличие токена
        const authToken = localStorage.getItem('authToken');
        const savedPhone = localStorage.getItem('userPhone');
        
        if (authToken && savedPhone) {
            this.isAuthenticated = true;
            this.userPhone = savedPhone;
            this.showCabinet();
        } else {
            this.showAuthModal();
        }
    }
    
    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        let formatted = '';
        if (value.length >= 1) {
            formatted += '(' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(8, 10);
        }
        
        e.target.value = formatted;
        this.userPhone = '+7' + value;
    }
    
    validatePhone() {
        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(this.userPhone)) {
            this.showError('phone', 'Введите корректный номер телефона');
            return false;
        }
        return true;
    }
    
    handleSMSInput(e, index) {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        
        this.clearError('sms');
        
        // Автоматический переход к следующему полю
        if (value && index < this.smsDigits.length - 1) {
            this.smsDigits[index + 1].focus();
        }
        
        // Автоматическая отправка при заполнении всех полей
        if (this.getSMSCode().length === 4) {
            setTimeout(() => {
                this.verifySMS();
            }, 300);
        }
    }
    
    handleSMSKeydown(e, index) {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            this.smsDigits[index - 1].focus();
        }
        
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
        const isNumber = /[0-9]/.test(e.key);
        
        if (!isNumber && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    }
    
    handleSMSPaste(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pastedData.length >= 4) {
            for (let i = 0; i < 4; i++) {
                if (this.smsDigits[i]) {
                    this.smsDigits[i].value = pastedData[i] || '';
                }
            }
            
            setTimeout(() => {
                this.verifySMS();
            }, 300);
        }
    }
    
    getSMSCode() {
        return Array.from(this.smsDigits).map(digit => digit.value).join('');
    }
    
    validateSMS() {
        const code = this.getSMSCode();
        if (code.length !== 4) {
            this.showError('sms', 'Введите 4-значный код');
            return false;
        }
        return true;
    }
    
    async sendSMS() {
        if (!this.validatePhone()) {
            return;
        }
        
        this.setLoading(this.sendSmsBtn, true);
        
        try {
            // Имитация отправки SMS
            await this.delay(1500);
            
            console.log('SMS отправлен на номер:', this.userPhone);
            this.showSMSModal();
            
        } catch (error) {
            this.showError('phone', 'Ошибка отправки SMS. Попробуйте еще раз.');
        } finally {
            this.setLoading(this.sendSmsBtn, false);
        }
    }
    
    async verifySMS() {
        if (!this.validateSMS()) {
            return;
        }
        
        this.setLoading(this.verifySmsBtn, true);
        
        try {
            // Имитация проверки кода
            await this.delay(1000);
            
            const code = this.getSMSCode();
            console.log('Код подтвержден:', code);
            
            // Успешная авторизация
            this.authenticate();
            
        } catch (error) {
            this.showError('sms', 'Неверный код. Попробуйте еще раз.');
            this.clearSMSInputs();
        } finally {
            this.setLoading(this.verifySmsBtn, false);
        }
    }
    
    async resendSMS() {
        this.setLoading(this.resendBtn, true);
        
        try {
            await this.delay(1000);
            console.log('SMS отправлен повторно');
            this.startResendTimer();
        } catch (error) {
            this.showError('sms', 'Ошибка отправки SMS');
        } finally {
            this.setLoading(this.resendBtn, false);
        }
    }
    
    authenticate() {
        this.isAuthenticated = true;
        
        // Сохраняем данные в localStorage
        localStorage.setItem('authToken', 'user_token_' + Date.now());
        localStorage.setItem('userPhone', this.userPhone);
        
        this.hideModals();
        this.showCabinet();
    }
    
    logout() {
        this.isAuthenticated = false;
        this.userPhone = '';
        
        // Очищаем localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userPhone');
        
        // Перезагружаем страницу для повторной авторизации
        window.location.reload();
    }
    
    showAuthModal() {
        this.hideLoader();
        this.modalOverlay.classList.add('active');
        this.phoneModal.classList.add('active');
        this.currentStep = 'phone';
        
        setTimeout(() => {
            this.phoneInput.focus();
        }, 300);
        
        document.body.style.overflow = 'hidden';
    }
    
    showSMSModal() {
        this.phoneModal.classList.remove('active');
        this.smsModal.classList.add('active');
        this.currentStep = 'sms';
        
        this.phoneDisplay.textContent = this.userPhone;
        this.clearSMSInputs();
        
        setTimeout(() => {
            this.smsDigits[0].focus();
        }, 300);
        
        this.startResendTimer();
    }
    
    backToPhone() {
        this.smsModal.classList.remove('active');
        this.phoneModal.classList.add('active');
        this.currentStep = 'phone';
        
        this.clearSMSInputs();
        this.clearError('sms');
        this.stopResendTimer();
        
        setTimeout(() => {
            this.phoneInput.focus();
        }, 300);
    }
    
    hideModals() {
        this.modalOverlay.classList.remove('active');
        this.phoneModal.classList.remove('active');
        this.smsModal.classList.remove('active');
        document.body.style.overflow = '';
        this.stopResendTimer();
    }
    
    showCabinet() {
        this.hideLoader();
        this.hideModals();
        this.cabinetContent.style.display = 'block';
        this.userPhoneDisplay.textContent = this.userPhone;
        
        // Анимация появления контента
        setTimeout(() => {
            this.cabinetContent.style.opacity = '1';
        }, 100);
    }
    
    hideLoader() {
        this.loader.classList.add('hidden');
        setTimeout(() => {
            this.loader.style.display = 'none';
        }, 500);
    }
    
    startResendTimer() {
        this.resendSeconds = 60;
        this.resendBtn.disabled = true;
        this.resendBtn.style.opacity = '0.5';
        
        this.resendTimer = setInterval(() => {
            this.resendSeconds--;
            this.timer.textContent = this.resendSeconds;
            
            if (this.resendSeconds <= 0) {
                this.stopResendTimer();
                this.resendBtn.disabled = false;
                this.resendBtn.style.opacity = '1';
            }
        }, 1000);
    }
    
    stopResendTimer() {
        if (this.resendTimer) {
            clearInterval(this.resendTimer);
            this.resendTimer = null;
        }
    }
    
    clearSMSInputs() {
        this.smsDigits.forEach(digit => {
            digit.value = '';
        });
    }
    
    showError(type, message) {
        const errorElement = type === 'phone' ? this.phoneError : this.smsError;
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(type) {
        const errorElement = type === 'phone' ? this.phoneError : this.smsError;
        errorElement.classList.remove('show');
    }
    
    setLoading(button, isLoading) {
        const text = button.querySelector('.btn-text');
        const spinner = button.querySelector('.btn-spinner');
        
        if (isLoading) {
            text.style.display = 'none';
            spinner.style.display = 'block';
            button.disabled = true;
        } else {
            text.style.display = 'block';
            spinner.style.display = 'none';
            button.disabled = false;
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.personalCabinet = new PersonalCabinet();
});

// Предотвращение закрытия страницы без авторизации
window.addEventListener('beforeunload', function(e) {
    if (!window.personalCabinet || !window.personalCabinet.isAuthenticated) {
        e.preventDefault();
        e.returnValue = '';
    }
});
