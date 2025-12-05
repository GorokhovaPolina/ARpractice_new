import { initARScene } from './ar-scene.js';
import { setupInteractions } from './interactions.js';
import { handleGestures } from './gestures.js';
import { manageAnimations } from './animations.js';
import { uiControls } from './ui-controls.js';
import { preloadAssets } from './assets.js';

let currentScene = null;
let isInitialized = false;

async function startApp() {
    const spinner = document.getElementById('loading-spinner');
    const notification = document.getElementById('notification');
    
    spinner.style.display = 'block';
    notification.textContent = 'Loading application...';

    try {
        // Предзагрузка ассетов
        await preloadAssets();
        console.log('✅ Assets preloaded');
        
        // Инициализация UI контролов
        uiControls();
        
        // Инициализация AR сцены (но не показываем)
        initARScene();
        
        isInitialized = true;
        notification.textContent = 'Ready! Click "Start AR" or "Test without AR"';
        
    } catch (error) {
        console.error('❌ Error starting app:', error);
        notification.textContent = `Error: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
}

// Функция переключения между сценами
export function switchScene(sceneType) {
    if (!isInitialized) {
        console.error('App not initialized yet');
        return;
    }

    const arScene = document.getElementById('ar-scene');
    const noArScene = document.getElementById('no-ar-scene');
    const notification = document.getElementById('notification');
    
    // Скрыть все сцены
    arScene.style.display = 'none';
    noArScene.style.display = 'none';
    
    // Остановить текущую анимацию
    if (currentScene) {
        const prefix = currentScene === 'ar' ? '' : '-noar';
        const currentDino = document.querySelector(`#dino${prefix}`);
        if (currentDino) {
            currentDino.emit('stopJump');
        }
    }
    
    // Показать выбранную сцену
    if (sceneType === 'ar') {
        notification.textContent = 'Scan Hiro marker with your camera';
        arScene.style.display = 'block';
        currentScene = 'ar';
        
        // Запустить взаимодействия для AR
        setTimeout(() => {
            setupInteractions('ar');
            handleGestures('ar');
            manageAnimations('ar');
        }, 100);
        
    } else if (sceneType === 'no-ar') {
        notification.textContent = '3D mode activated. Click on dino!';
        noArScene.style.display = 'block';
        currentScene = 'no-ar';
        
        // Запустить взаимодействия для 3D
        setTimeout(() => {
            setupInteractions('no-ar');
            handleGestures('no-ar');
            manageAnimations('no-ar');
            
            // Автозапуск анимации в 3D режиме
            const dino = document.querySelector('#dino-noar');
            if (dino) {
                dino.emit('startJump');
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', startApp);