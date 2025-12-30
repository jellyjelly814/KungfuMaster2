/**
 * 茅台购买提示特效
 * 显示购买茅台时的动画
 */
import ImageManager from '../utils/ImageManager.js';

class MaotaiPurchase {
    constructor(x, y, healAmount) {
        this.x = x;
        this.y = y;
        this.healAmount = healAmount;
        this.lifetime = 1.0; // 存活1秒
        this.age = 0;
        this.startY = y;
        this.scale = 0;
        this.fadeStart = 0.7; // 开始消失的时间点
    }
    
    /**
     * 更新状态
     */
    update(deltaTime) {
        this.age += deltaTime;
        this.y = this.startY - this.age * 20;
        
        // 缩放动画（弹跳效果）
        if (this.age < 0.2) {
            this.scale = this.age / 0.2; // 0到1
        } else {
            this.scale = 1;
        }
    }
    
    /**
     * 检查是否应该移除
     */
    isExpired() {
        return this.age >= this.lifetime;
    }
    
    /**
     * 获取透明度
     */
    getOpacity() {
        if (this.age < this.fadeStart) {
            return 1;
        }
        const fadeDuration = this.lifetime - this.fadeStart;
        const fadeProgress = (this.age - this.fadeStart) / fadeDuration;
        return 1 - fadeProgress;
    }
    
    /**
     * 绘制
     */
    draw(ctx) {
        const opacity = this.getOpacity();
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        
        // 尝试使用茅台图片
        const maotaiImage = ImageManager.get('maotai');
        
        if (maotaiImage) {
            // 使用图片绘制
            const size = 80; // 2倍大（原来是40）
            ctx.drawImage(maotaiImage, -size/2, -size/2, size, size);
        } else {
            // 如果图片加载失败，使用文字
            // 背景框
            ctx.fillStyle = 'rgba(46, 213, 115, 0.9)';
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            
            const width = 240;
            const height = 80;
            
            ctx.beginPath();
            ctx.roundRect(-width/2, -height/2, width, height, 20);
            ctx.fill();
            ctx.stroke();
            
            // 文字
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`+${this.healAmount} ❤️`, 0, 0);
        }
        
        ctx.restore();
    }
}

export default MaotaiPurchase;

