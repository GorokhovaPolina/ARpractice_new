export function uiControls() {
    const startArBtn = document.getElementById('start-ar');
    const testNoArBtn = document.getElementById('test-no-ar');
    const resetBtn = document.getElementById('reset-scene');
    const notification = document.getElementById('notification');

    startArBtn.addEventListener('click', async () => {
        notification.textContent = 'Requesting camera access...';
        startArBtn.disabled = true;
        
        try {
            // Проверяем доступность камеры
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not supported');
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            // Останавливаем поток (AR.js создаст свой)
            stream.getTracks().forEach(track => track.stop());
            
            notification.textContent = 'Camera ready! Scanning for Hiro marker...';
            
            // Импортируем и переключаем на AR сцену
            import('./main.js').then(module => {
                setTimeout(() => {
                    module.switchScene('ar');
                }, 500);
            });
            
        } catch (error) {
            console.error('Camera error:', error);
            notification.textContent = 'Camera access failed. Switching to 3D mode.';
            
            import('./main.js').then(module => {
                setTimeout(() => {
                    module.switchScene('no-ar');
                }, 500);
            });
        } finally {
            startArBtn.disabled = false;
        }
    });

    testNoArBtn.addEventListener('click', () => {
        notification.textContent = 'Starting 3D mode...';
        testNoArBtn.disabled = true;
        
        import('./main.js').then(module => {
            module.switchScene('no-ar');
            setTimeout(() => {
                testNoArBtn.disabled = false;
            }, 1000);
        });
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Reset the scene? All progress will be lost.')) {
            location.reload();
        }
    });
}