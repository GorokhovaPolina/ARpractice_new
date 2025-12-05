export function manageAnimations(sceneType = 'ar') {
    const prefix = sceneType === 'ar' ? '' : '-noar';
    const dino = document.querySelector(`#dino${prefix}`);
    const scoreElement = document.getElementById('score');
    
    if (!dino) {
        console.error(`Dino not found for scene: ${sceneType}`);
        return;
    }

    let score = 0;
    let gameOver = false;
    let lastTime = 0;
    let animationId = null;

    // Находим препятствия
    const obstacles = [
        document.querySelector(`#cactus1${prefix}`),
        document.querySelector(`#cactus2${prefix}`)
    ].filter(obs => obs !== null);

    // Запускаем анимацию прыжка для динозавра
    setTimeout(() => {
        if (dino && dino.getAttribute('visible') !== 'false') {
            dino.emit('startJump');
        }
    }, 1000);

    function updateObstacles() {
        obstacles.forEach((obstacle, index) => {
            if (!obstacle) return;
            
            let pos = obstacle.getAttribute('position');
            if (!pos) return;
            
            // Двигаем препятствие
            pos.x -= 0.05;
            
            // Возвращаем в начало если ушло за экран
            if (pos.x < -2) {
                pos.x = 2 + (index * 1.5);
            }
            
            obstacle.setAttribute('position', pos);
            
            // Проверяем столкновение с динозавром
            if (!gameOver && dino && dino.getAttribute('visible') !== 'false') {
                const dinoPos = dino.getAttribute('position');
                const dinoScale = dino.getAttribute('scale') || {x: 1, y: 1, z: 1};
                
                // Упрощенная проверка столкновения
                const distance = Math.abs(pos.x - dinoPos.x);
                const collisionThreshold = 0.3 * Math.max(dinoScale.x, dinoScale.y, dinoScale.z);
                
                if (distance < collisionThreshold && dinoPos.y < 0.5) {
                    gameOver = true;
                    dino.emit('stopJump');
                    
                    // Показываем Game Over
                    setTimeout(() => {
                        alert(`Game Over! Your score: ${score}`);
                        // Сбрасываем игру
                        score = 0;
                        gameOver = false;
                        scoreElement.textContent = 'Score: 0';
                        
                        // Перезапускаем анимацию
                        if (dino.getAttribute('visible') !== 'false') {
                            dino.emit('startJump');
                        }
                    }, 100);
                }
            }
        });
    }

    function gameLoop(time) {
        if (gameOver) {
            cancelAnimationFrame(animationId);
            return;
        }

        const delta = time - lastTime;
        if (delta > 50) { // ~20 FPS для игры
            // Обновляем препятствия
            updateObstacles();
            
            // Обновляем счет
            if (dino && dino.getAttribute('visible') !== 'false') {
                score += 1;
                scoreElement.textContent = `Score: ${score}`;
            }
            
            lastTime = time;
        }
        
        animationId = requestAnimationFrame(gameLoop);
    }

    // Запускаем игровой цикл
    gameLoop(0);

    // Очистка при переключении сцен
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (dino) {
            dino.emit('stopJump');
        }
    };
}