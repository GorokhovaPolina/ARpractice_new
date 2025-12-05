export function handleGestures(sceneType = 'ar') {
    const prefix = sceneType === 'ar' ? '' : '-noar';
    const scene = document.querySelector(sceneType === 'ar' ? '#ar-scene' : '#no-ar-scene');
    
    if (!scene) {
        console.error(`Scene not found for: ${sceneType}`);
        return;
    }

    // Инициализация Hammer.js
    const hammer = new Hammer(scene);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('pinch').set({ enable: true });
    hammer.get('rotate').set({ enable: true });

    let isCatVisible = false;
    let lastSwipeTime = 0;
    const swipeCooldown = 500; // 0.5 секунды между свайпами

    hammer.on('swipe', (ev) => {
        const now = Date.now();
        if (now - lastSwipeTime < swipeCooldown) return;
        lastSwipeTime = now;

        try {
            const dino = document.querySelector(`#dino${prefix}`);
            const cat = document.querySelector(`#cat${prefix}`);
            
            if (!dino || !cat) {
                console.error('Dino or Cat not found');
                return;
            }

            // Свайп влево/вправо - переключение между динозавром и котом
            if (ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_RIGHT) {
                if (!isCatVisible) {
                    // Переключаем на кота
                    dino.setAttribute('visible', 'false');
                    cat.setAttribute('visible', 'true');
                    isCatVisible = true;
                    
                    // Проигрываем звук кота
                    const meowSound = document.querySelector(`#meow-sound${prefix}`);
                    if (meowSound && meowSound.components.sound) {
                        meowSound.components.sound.playSound();
                    }
                    
                    console.log('Switched to Cat');
                    
                    // Автоматически возвращаемся к динозавру через 3 секунды
                    setTimeout(() => {
                        if (isCatVisible) {
                            cat.setAttribute('visible', 'false');
                            dino.setAttribute('visible', 'true');
                            isCatVisible = false;
                            console.log('Auto-switched back to Dino');
                        }
                    }, 3000);
                    
                } else {
                    // Переключаем на динозавра
                    cat.setAttribute('visible', 'false');
                    dino.setAttribute('visible', 'true');
                    isCatVisible = false;
                    
                    // Проигрываем звук прыжка
                    const jumpSound = document.querySelector(`#jump-sound${prefix}`);
                    if (jumpSound && jumpSound.components.sound) {
                        jumpSound.components.sound.playSound();
                    }
                    
                    console.log('Switched to Dino');
                }
            }
            
            // Свайп вверх - прыжок
            if (ev.direction === Hammer.DIRECTION_UP && !isCatVisible) {
                if (dino) {
                    // Применяем импульс для прыжка
                    if (dino.body && dino.body.applyImpulse) {
                        const impulse = new CANNON.Vec3(0, 5, 0);
                        const worldPoint = new CANNON.Vec3().copy(dino.body.position);
                        dino.body.applyImpulse(impulse, worldPoint);
                    }
                    
                    // Запускаем анимацию
                    dino.emit('startJump');
                    setTimeout(() => dino.emit('stopJump'), 500);
                    
                    const jumpSound = document.querySelector(`#jump-sound${prefix}`);
                    if (jumpSound && jumpSound.components.sound) {
                        jumpSound.components.sound.playSound();
                    }
                }
            }
            
        } catch (error) {
            console.error('Swipe error:', error);
        }
    });

    hammer.on('pinch', (ev) => {
        try {
            const dino = document.querySelector(`#dino${prefix}`);
            if (dino && dino.object3D) {
                const currentScale = dino.object3D.scale.x;
                const newScale = currentScale * ev.scale;
                // Ограничиваем масштаб
                if (newScale > 0.01 && newScale < 2) {
                    dino.object3D.scale.set(newScale, newScale, newScale);
                }
            }
        } catch (error) {
            console.error('Pinch error:', error);
        }
    });

    hammer.on('rotate', (ev) => {
        try {
            const dino = document.querySelector(`#dino${prefix}`);
            if (dino && dino.object3D) {
                dino.object3D.rotation.y += ev.rotation * 0.01;
            }
        } catch (error) {
            console.error('Rotate error:', error);
        }
    });

    // Также добавляем обработку тапов (на случай если свайпы не работают)
    hammer.on('tap', (ev) => {
        const target = ev.target || document.elementFromPoint(ev.center.x, ev.center.y);
        if (target && target.classList && target.classList.contains('clickable')) {
            target.click();
        }
    });
}