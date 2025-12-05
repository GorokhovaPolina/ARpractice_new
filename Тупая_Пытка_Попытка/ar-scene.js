export function initARScene() {
    const scene = document.querySelector('#ar-scene');
    const marker = document.querySelector('a-marker');
    const notification = document.getElementById('notification');
    
    if (!scene || !marker) {
        console.error('AR Scene or Marker not found');
        setTimeout(initARScene, 1000); // Повторная попытка
        return;
    }

    console.log('AR Scene initialized');

    // Событие обнаружения маркера
    marker.addEventListener('markerFound', () => {
        console.log('✅ Marker found!');
        notification.textContent = 'Marker found! Dino is here!';
        
        // Показываем динозавра
        const dino = document.querySelector('#dino');
        const cat = document.querySelector('#cat');
        
        if (dino) {
            dino.setAttribute('visible', 'true');
            // Запускаем анимацию
            setTimeout(() => {
                dino.emit('startJump');
            }, 500);
        }
        
        if (cat) {
            cat.setAttribute('visible', 'false');
        }
        
        // Показываем препятствия
        const cactus1 = document.querySelector('#cactus1');
        const cactus2 = document.querySelector('#cactus2');
        if (cactus1) cactus1.setAttribute('visible', 'true');
        if (cactus2) cactus2.setAttribute('visible', 'true');
    });

    // Событие потери маркера
    marker.addEventListener('markerLost', () => {
        console.log('❌ Marker lost');
        notification.textContent = 'Point camera at Hiro marker';
        
        // Прячем объекты
        const dino = document.querySelector('#dino');
        const cat = document.querySelector('#cat');
        const cactus1 = document.querySelector('#cactus1');
        const cactus2 = document.querySelector('#cactus2');
        
        if (dino) {
            dino.setAttribute('visible', 'false');
            dino.emit('stopJump');
        }
        if (cat) cat.setAttribute('visible', 'false');
        if (cactus1) cactus1.setAttribute('visible', 'false');
        if (cactus2) cactus2.setAttribute('visible', 'false');
    });

    // Проверка поддержки гироскопа
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            // Можно использовать для дополнительных взаимодействий
        }, false);
    }
}