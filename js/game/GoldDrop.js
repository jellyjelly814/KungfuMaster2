/**
 * 金币掉落特效
 * 显示金币掉落的动画
 */
class GoldDrop {
    constructor(x, y, amount) {
        this.x = x;
        this.y = y;
        this.amount = amount;
        this.lifetime = 1.5; // 存活1.5秒
        this.age = 0;
        this.startY = y;
        this.floatingOffset = 0;
        this.fadeStart = 1.0; // 开始消失的时间点
    }
    
    /**
     * 更新状态
     */
    update(deltaTime) {
        this.age += deltaTime;
        
        // 浮动动画
        this.floatingOffset = Math.sin(this.age * 3) * 5;
        
        // 慢慢向上飘
        this.y = this.startY - this.age * 30;
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
        // 最后0.5秒淡出
        const fadeDuration = this.lifetime - this.fadeStart;
        const fadeProgress = (this.age - this.fadeStart) / fadeDuration;
        return 1 - fadeProgress;
    }
    
    /**
     * 绘制金币
     */
    draw(ctx) {
        const opacity = this.getOpacity();
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // 绘制金币图标和数字
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 3;
        
        const text = `+${this.amount} 💰`;
        ctx.strokeText(text, this.x, this.y + this.floatingOffset);
        ctx.fillText(text, this.x, this.y + this.floatingOffset);
        
        // 金币闪光效果
        this.drawSparkle(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制闪光粒子
     */
    drawSparkle(ctx) {
        const sparkleCount = 3;
        const time = Date.now() / 100;
        
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (time + i * 2) % (Math.PI * 2);
            const distance = 20 + Math.sin(time + i) * 5;
            const sparkleX = this.x + Math.cos(angle) * distance;
            const sparkleY = this.y + this.floatingOffset + Math.sin(angle) * distance;
            
            ctx.fillStyle = '#ffec8b';
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export default GoldDrop;

