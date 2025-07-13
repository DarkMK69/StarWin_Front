document.addEventListener('DOMContentLoaded', async () => {
    // Инициализация Telegram WebApp
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.enableClosingConfirmation();
    
    // Получаем данные пользователя
    const tgUser = Telegram.WebApp.initDataUnsafe.user;
    if (tgUser) {
        document.getElementById('user-avatar').src = tgUser.photo_url || '/static/images/default-avatar.png';
    }
    
    // Загрузка баланса
    await loadBalance();
    
    // Загрузка последних битв
    await loadRecentBattles();
    
    // Обработчики событий
    setupEventListeners();
});

async function loadBalance() {
    try {
        // Здесь будет запрос к вашему API
        const balance = 1000; // Примерное значение
        document.querySelector('.balance').textContent = balance;
    } catch (error) {
        console.error('Error loading balance:', error);
    }
}

async function loadRecentBattles() {
    try {
        // Здесь будет запрос к вашему API
        const battles = [
            { id: 1, players: ['@durov', '@zhukov'], winner: '@durov', prize: 100 },
            { id: 2, players: ['@zhukov', '@mask'], winner: '@mask', prize: 200 },
            { id: 3, players: ['@durov', '@mask'], winner: '@durov', prize: 150 }
        ];
        
        const battlesList = document.querySelector('.battles-list');
        battlesList.innerHTML = battles.map(battle => `
            <div class="battle-item">
                <div class="players">
                    ${battle.players.map(p => `<span class="player">${p}</span>`).join(' vs ')}
                </div>
                <div class="result">
                    Победитель: <span class="winner">${battle.winner}</span> (+${battle.prize} звёзд)
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading recent battles:', error);
    }
}

function setupEventListeners() {
    // Выбор типа битвы
    document.querySelectorAll('.battle-type').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.battle-type').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
        });
    });
    
    // Начало битвы
    document.getElementById('start-battle').addEventListener('click', async () => {
        const battleType = document.querySelector('.battle-type.active').dataset.type;
        Telegram.WebApp.showPopup({
            title: 'Подтверждение',
            message: `Вы уверены, что хотите начать ${getBattleTypeName(battleType)}?`,
            buttons: [
                { id: 'confirm', type: 'ok', text: 'Да' },
                { id: 'cancel', type: 'cancel', text: 'Отмена' }
            ]
        }, (buttonId) => {
            if (buttonId === 'confirm') {
                startBattle(battleType);
            }
        });
    });
    
    // Навигация
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
        });
    });
}

function getBattleTypeName(type) {
    const names = {
        'quick': 'быструю битву',
        'premium': 'премиум битву',
        'elite': 'элитную битву'
    };
    return names[type] || 'битву';
}

async function startBattle(type) {
    try {
        // Здесь будет запрос к вашему API для начала битвы
        Telegram.WebApp.showAlert(`Битва типа ${type} начата!`);
        
        // Перенаправление на страницу битвы
        setTimeout(() => {
            navigateTo('battle');
        }, 1000);
    } catch (error) {
        console.error('Error starting battle:', error);
        Telegram.WebApp.showAlert('Ошибка при начале битвы');
    }
}

function navigateTo(page) {
    // В реальном приложении это будет переход между страницами
    console.log(`Navigating to ${page}`);
    // Пример для SPA:
    // window.history.pushState({}, '', `/${page}`);
    // loadPage(page);
}