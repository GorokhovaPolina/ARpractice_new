export async function preloadAssets() {
    const assets = [
        { url: 'assets/tyrannosaurus_rex_rig/dino.gltf', type: 'model' },
        { url: 'assets/oiiaioooooiai_cat/cat.gltf', type: 'model' },
        { url: 'assets/jump.mp3', type: 'audio' },
        { url: 'assets/meow.mp3', type: 'audio' }
    ];

    console.log('Starting asset preload...');

    const promises = assets.map(async (asset) => {
        try {
            // Для GLTF моделей проверяем только заголовки
            if (asset.type === 'model') {
                const response = await fetch(asset.url, { method: 'HEAD' });
                if (!response.ok) {
                    throw new Error(`Model not found: ${asset.url}`);
                }
                console.log(`✅ ${asset.url} available`);
            } 
            // Для аудио предзагружаем
            else if (asset.type === 'audio') {
                const audio = new Audio();
                return new Promise((resolve, reject) => {
                    audio.preload = 'auto';
                    audio.oncanplaythrough = resolve;
                    audio.onerror = reject;
                    audio.src = asset.url;
                }).then(() => {
                    console.log(`✅ ${asset.url} preloaded`);
                });
            }
        } catch (error) {
            console.warn(`⚠️ Asset warning: ${asset.url} - ${error.message}`);
            // Продолжаем работу с fallback
            return Promise.resolve();
        }
    });

    await Promise.allSettled(promises);
    console.log('Asset preload complete');
}