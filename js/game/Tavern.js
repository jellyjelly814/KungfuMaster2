/**
 * 酒馆类
 * 管理游戏中的三个酒馆
 */
import GAME_CONFIG from '../utils/GameConfig.js';
import ImageManager from '../utils/ImageManager.js';

class Tavern {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.interactionRange = GAME_CONFIG.TAVERNS.INTERACTION_RANGE;
        
        this.item = 'maotai';
        this.price = GAME_CONFIG.ECONOMY.MAOTAI_PRICE;
        this.healAmount = GAME_CONFIG.ECONOMY.MAOTAI_HEAL;
        
        this.isActive = true;
        this.purchaseCount = 0;
        
        // 视觉属性
        this.pulseSize = 0;
        this.pulseDirection = 1;
    }
    
    /**
     * 检查玩家是否在交互范围内
     */
    isPlayerInRange(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.interactionRange;
    }
    
    /**
     * 检查是否可以购买
     */
    canPurchase(player) {
        return this.isActive &&
               player.gold >= this.price &&
               player.currentHp < GAME_CONFIG.ECONOMY.HEAL_THRESHOLD;
    }
    
    /**
     * 尝试购买
     */
    tryPurchase(player) {
        if (!this.canPurchase(player)) {
            return false;
        }
        
        // 执行购买
        player.gold -= this.price;
        player.heal(this.healAmount);
        this.purchaseCount++;
        
        return true;
    }
    
    /**
     * 更新酒馆状态
     */
    update(deltaTime) {
        // 脉冲动画
        this.pulseSize += this.pulseDirection * 50 * deltaTime;
        if (this.pulseSize > 5 || this.pulseSize < 0) {
            this.pulseDirection *= -1;
        }
    }
    
    /**
     * 检查点击是否在酒馆范围内
     */
    checkClick(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= 60; // 点击范围
    }
    
    /**
     * 绘制酒馆
     */
    draw(ctx, player) {
        const canPurchase = this.canPurchase(player);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 尝试使用酒馆图片
        const tavernImage = ImageManager.get('tavern');
        
        if (tavernImage) {
            // 使用图片绘制
            const scale = 1 + (this.pulseSize / 100) * (canPurchase ? 1 : 0);
            ctx.scale(scale, scale);
            const size = 120; // 2倍大
            
            // 可购买时添加发光效果
            if (canPurchase) {
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 20;
            }
            
            ctx.drawImage(tavernImage, -size/2, -size/2, size, size);
            ctx.shadowBlur = 0;
        } else {
            // 如果图片加载失败，使用原绘制
            // 绘制酒馆建筑
            const scale = 1 + (this.pulseSize / 100) * (canPurchase ? 1 : 0);
            ctx.scale(scale, scale);
            
            // 房子主体
            ctx.fillStyle = canPurchase ? '#2ed573' : '#636e72';
            ctx.fillRect(-20, -15, 40, 30);
            
            // 屋顶
            ctx.fillStyle = canPurchase ? '#26de81' : '#4b6584';
            ctx.beginPath();
            ctx.moveTo(-25, -15);
            ctx.lineTo(0, -35);
            ctx.lineTo(25, -15);
            ctx.closePath();
            ctx.fill();
            
            // 门
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(-8, 0, 16, 15);
            
            // 窗户
            ctx.fillStyle = canPurchase ? '#ffd700' : '#4b6584';
            ctx.fillRect(-15, -8, 8, 8);
            ctx.fillRect(7, -8, 8, 8);
            
            // 招牌
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏪', 0, 5);
            
            // 可购买提示
            if (canPurchase) {
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, this.interactionRange + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    /**
     * 获取位置
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
}

export default Tavern;

