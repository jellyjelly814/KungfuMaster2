/**
 * 图片资源管理器
 * 预加载并管理所有游戏图片
 */
const ImageManager = {
    images: {},
    
    // 加载所有图片
    async loadAll() {
        const imageFiles = [
            { name: 'monster1', path: 'image/monster1.png' },
            { name: 'monster2', path: 'image/monster2.png' },
            { name: 'monster3', path: 'image/monster3.png' },
            { name: 'monster4', path: 'image/monster4.png' },
            { name: 'player', path: 'image/player.png' },
            { name: 'maotai', path: 'image/maotai.png' },
            { name: 'sword', path: 'image/sword.png' },
            { name: 'tavern', path: 'image/tavern.png' },
            { name: 'boss', path: 'image/boss.png' },
            { name: 'background', path: 'image/background.jpg' },
        ];
        
        const promises = imageFiles.map(img => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    this.images[img.name] = image;
                    resolve();
                };
                image.onerror = () => {
                    console.warn(`无法加载图片: ${img.path}`);
                    // 使用默认图片
                    this.images[img.name] = null;
                    resolve();
                };
                image.src = img.path;
            });
        });
        
        await Promise.all(promises);
        console.log('图片加载完成');
    },
    
    // 获取图片
    get(name) {
        return this.images[name] || null;
    },
    
    // 检查图片是否加载
    isLoaded(name) {
        return this.images[name] !== undefined && this.images[name] !== null;
    },
};

export default ImageManager;

