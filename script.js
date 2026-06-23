// ФУНКЦИЯ ОБРАБОТКИ ОТВЕТА С ПОДСВЕТКОЙ
function handleAnswer(selectedIndex) {
    if (state.processing || state.gameOver || state.showSega) return;
    if (!state.currentWord) return;

    state.processing = true;
    const isCorrect = (selectedIndex === state.correctIndex);

    // ПОДСВЕТКА КНОПОК
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach((btn, idx) => {
        // Сначала сбрасываем все стили
        btn.style.transition = 'all 0.3s';
        
        if (idx === state.correctIndex) {
            // ПРАВИЛЬНЫЙ ОТВЕТ - ЗЕЛЁНЫЙ
            btn.style.background = '#44ff44';
            btn.style.boxShadow = '0 0 30px #44ff44, 0 0 60px #44ff88';
            btn.style.transform = 'scale(1.1)';
        } else if (idx === selectedIndex && !isCorrect) {
            // НЕПРАВИЛЬНЫЙ ОТВЕТ, КОТОРЫЙ НАЖАЛ ПОЛЬЗОВАТЕЛЬ - КРАСНЫЙ
            btn.style.background = '#ff2222';
            btn.style.boxShadow = '0 0 40px #ff2222, 0 0 80px #ff0000';
            btn.style.transform = 'scale(0.9)';
            btn.style.animation = 'shake 0.3s ease-in-out';
        } else {
            // Остальные кнопки - затемнённые
            btn.style.background = '#333333';
            btn.style.boxShadow = 'none';
            btn.style.transform = 'scale(0.95)';
            btn.style.opacity = '0.5';
        }
    });

    if (isCorrect) {
        state.playerPunch = true;
        state.punchTimer = 20;
        const damage = 10 + (state.comboCount >= state.maxCombo ? 15 : 0);
        state.enemyHP = Math.max(0, state.enemyHP - damage);
        state.comboCount++;
        if (state.comboCount >= state.maxCombo) state.comboCount = 0;

        if (state.enemyHP <= 0) {
            state.enemyHP = 0;
            state.gameOver = true;
            state.winner = 'player';
            state.processing = false;
            return;
        }

        state.roundDelay = 30;
        setTimeout(() => {
            if (!state.gameOver) newRound();
            state.processing = false;
            resetButtonColors();
        }, 500);
    } else {
        state.enemyPunch = true;
        state.enemyPunchTimer = 20;
        const damage = 10 + (state.comboCount >= state.maxCombo ? 5 : 0);
        state.playerHP = Math.max(0, state.playerHP - damage);
        state.comboCount = 0;

        if (state.playerHP <= 0) {
            state.playerHP = 0;
            state.gameOver = true;
            state.winner = 'enemy';
            state.processing = false;
            return;
        }

        state.roundDelay = 30;
        setTimeout(() => {
            if (!state.gameOver) newRound();
            state.processing = false;
            resetButtonColors();
        }, 500);
    }
}

// ФУНКЦИЯ СБРОСА ЦВЕТА КНОПОК
function resetButtonColors() {
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => {
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.style.transform = '';
        btn.style.opacity = '';
        btn.style.animation = '';
        btn.style.transition = 'all 0.3s';
    });
}

function newRound() {
    if (state.gameOver) return;
    const q = generateQuestion();
    state.currentWord = q.word;
    state.options = q.options;
    state.correctIndex = q.correctIndex;
    state.processing = false;
    state.roundDelay = 0;
    state.playerPunch = false;
    state.enemyPunch = false;
    state.punchTimer = 0;
    state.enemyPunchTimer = 0;
    
    // Сброс цвета при новом раунде
    resetButtonColors();
}