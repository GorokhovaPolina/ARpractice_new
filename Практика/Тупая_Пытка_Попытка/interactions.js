export function setupInteractions(sceneType = 'ar') {
    const prefix = sceneType === 'ar' ? '' : '-noar';
    const dino = document.querySelector(`#dino${prefix}`);
    const cat = document.querySelector(`#cat${prefix}`);
    
    if (!dino || !cat) {
        console.warn(`Interaction elements not found for ${sceneType}, will retry...`);
        setTimeout(() => setupInteractions(sceneType), 500);
        return;
    }

    console.log(`Setting up interactions for ${sceneType}`);

    // Fallback для моделей
    setTimeout(() => {
        const checkAndApplyFallback = () => {
            // Проверяем динозавра
            const dinoModel = dino.getAttribute('gltf-model');
            if (!dinoModel || dinoModel.includes('undefined') || dinoModel.includes('null')) {
                console.log('Applying fallback to dino');
                dino.setAttribute('geometry', 'primitive: box; width: 1; height: 1.5; depth: 1');
                dino.setAttribute('material', 'color: #00ff00; metalness: 0.5; roughness: 0.5');
            }
            
            // Проверяем кота
            const catModel = cat.getAttribute('gltf-model');
            if (!catModel || catModel.includes('undefined') || catModel.includes('null')) {
                console.log('Applying fallback to cat');
                cat.setAttribute('geometry', 'primitive: sphere; radius: 0.5');
                cat.setAttribute('material', 'color: #ff00ff; metalness: 0.3; roughness: 0.7');
            }
        };
        
        checkAndApplyFallback();
    }, 2000);

    // Клик по динозавру
    dino.addEventListener('click', (event) => {
        event.stopPropagation();
        
        console.log('Dino clicked!');
        
        // Меняем цвет на красный
        dino.setAttribute('material', 'color', '#ff5555');
        
        // Проигрываем звук прыжка
        const jumpSound = document.querySelector(`#jump-sound${prefix}`);
        if (jumpSound && jumpSound.components && jumpSound.components.sound) {
            jumpSound.components.sound.playSound();
        } else {
            // Fallback для звука
            try {
                const audio = new Audio('assets/jump.mp3');
                audio.volume = 0.5;
                audio.play();
            } catch (e) {
                console.log('Sound play failed:', e);
            }
        }
        
        // Применяем физический импульс для прыжка
        if (dino.body && typeof dino.body.applyImpulse === 'function') {
            const impulse = new CANNON.Vec3(0, 8, 0);
            const worldPoint = new CANNON.Vec3().copy(dino.body.position);
            dino.body.applyImpulse(impulse, worldPoint);
        }
        
        // Запускаем анимацию прыжка
        dino.emit('startJump');
        setTimeout(() => {
            dino.emit('stopJump');
            // Возвращаем цвет
            setTimeout(() => {
                dino.setAttribute('material', 'color', '#00ff00');
            }, 100);
        }, 500);
    });

    // Клик по коту
    cat.addEventListener('click', (event) => {
        event.stopPropagation();
        
        console.log('Cat clicked!');
        
        // Меняем цвет
        cat.setAttribute('material', 'color', '#ffff55');
        
        // Проигрываем звук
        const meowSound = document.querySelector(`#meow-sound${prefix}`);
        if (meowSound && meowSound.components && meowSound.components.sound) {
            meowSound.components.sound.playSound();
        }
        
        // Возвращаем цвет через секунду
        setTimeout(() => {
            cat.setAttribute('material', 'color', '#ff00ff');
        }, 1000);
    });

    // Drag для вращения (только для 3D режима)
    if (sceneType === 'no-ar') {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        dino.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { 
                x: e.clientX || e.touches[0].clientX, 
                y: e.clientY || e.touches[0].clientY 
            };
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;
            
            const deltaX = currentX - previousMousePosition.x;
            const deltaY = currentY - previousMousePosition.y;
            
            dino.object3D.rotation.y += deltaX * 0.01;
            dino.object3D.rotation.x += deltaY * 0.01;
            
            previousMousePosition = { x: currentX, y: currentY };
            e.preventDefault();
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        }, { passive: false });
    }
}