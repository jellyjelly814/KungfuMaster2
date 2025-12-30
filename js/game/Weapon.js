/**
 * 武器类
 * 管理武僧的旋转武器
 */
import GAME_CONFIG from '../utils/GameConfig.js';
import { getPositionFromAngle } from '../utils/Utils.js';
import ImageManager from '../utils/ImageManager.js';

class Weapon {
    constructor(id, angle, player) {
        this.id = id;
        this.angle = angle; // 当前角度（弧度）
        this.player = player;
        this.damage = GAME_CONFIG.WEAPON.DAMAGE;
        this.distance = GAME_CONFIG.WEAPON.DISTANCE;
        this.radius = GAME_CONFIG.WEAPON.SIZE;
        this.rotationSpeed = player.rotationSpeed;
        this.isActive = true;
        
        // 计算初始位置
        this.updatePosition();
    }
    
    /**
     * 更新位置
     */
    updatePosition() {
        const pos = getPositionFromAngle(
            this.player.x, 
            this.player.y, 
            this.angle, 
            this.distance
        );
        this.x = pos.x;
        this.y = pos.y;
    }
    
    /**
     * 更新武器状态
     */
    update(deltaTime) {
        // 更新角度（顺时针旋转）
        this.angle += this.rotationSpeed * 2 * Math.PI * deltaTime;
        
        // 保持角度在 0-2π 范围内
        if (this.angle > 2 * Math.PI) {
            this.angle -= 2 * Math.PI;
        }
        
        // 更新位置
        this.updatePosition();
    }
    
    /**
     * 绘制武器
     */
    draw(ctx) {
        if (!this.isActive) return;
        
        // 尝试使用剑的图片
        const swordImage = ImageManager.get('sword');
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2); // 旋转以指向切线方向
        
        if (swordImage) {
            // 使用图片绘制
            const size = this.radius * 3;
            ctx.drawImage(swordImage, -this.radius, -this.radius * 1.5, size, size);
        } else {
            // 如果图片加载失败，使用原绘制
            // 绘制剑的形状
            ctx.fillStyle = '#ffd700'; // 金色
            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 2;
            
            // 剑身
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(this.radius / 2, this.radius);
            ctx.lineTo(0, this.radius * 0.7);
            ctx.lineTo(-this.radius / 2, this.radius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // 剑柄
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(-3, this.radius * 0.5, 6, this.radius * 0.5);
        }
        
        ctx.restore();
    }
    
    /**
     * 冷却（用于避免一次攻击多次判定）
     */
    cooldown() {
        // 可以添加攻击冷却逻辑
    }
}

export default Weapon;

