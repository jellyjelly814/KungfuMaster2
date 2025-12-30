/**
 * 怪物类
 * 管理各种类型的怪物
 */
import GAME_CONFIG from '../utils/GameConfig.js';
import { getDistance, randomInt } from '../utils/Utils.js';
import ImageManager from '../utils/ImageManager.js';

class Monster {
    constructor(type, canvasWidth, canvasHeight, player) {
        this.type = type;
        this.player = player;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // 根据类型获取属性（转换为大写匹配配置）
        const config = GAME_CONFIG.MONSTERS[type.toUpperCase()];
        
        // 检查配置是否存在
        if (!config) {
            console.error(`未找到怪物类型配置: ${type}`);
            this.maxHp = 10;
            this.currentHp = 10;
            this.damage = 5;
            this.speed = 80;
            this.goldMin = 1;
            this.goldMax = 2;
            this.radius = 15;
            this.color = '#4ade80';
        } else {
            // 计算难度系数（每级+5%血量和伤害）
            const playerLevel = this.player ? this.player.level : 1;
            const difficultyMultiplier = 1 + (playerLevel - 1) * 0.05;
            
            this.maxHp = Math.floor(config.HP * difficultyMultiplier);
            this.currentHp = this.maxHp;
            this.damage = config.DAMAGE; // 伤害不随等级增加，保持平衡
            this.speed = config.SPEED;
            this.goldMin = config.GOLD_MIN;
            this.goldMax = config.GOLD_MAX;
            this.radius = config.SIZE;
            this.color = config.COLOR;
            
            // 记录难度系数（用于调试）
            this.difficultyLevel = playerLevel;
        }
        
        // 初始化位置（在屏幕边缘生成）
        this.spawn();
        
        // 状态
        this.isAlive = true;
        this.spawnTime = Date.now();
    }
    
    /**
     * 在屏幕边缘生成
     */
    spawn() {
        // 随机选择一边
        const side = Math.floor(Math.random() * 4); // 0:上, 1:右, 2:下, 3:左
        
        switch (side) {
            case 0: // 上边
                this.x = Math.random() * this.canvasWidth;
                this.y = -this.radius;
                break;
            case 1: // 右边
                this.x = this.canvasWidth + this.radius;
                this.y = Math.random() * this.canvasHeight;
                break;
            case 2: // 下边
                this.x = Math.random() * this.canvasWidth;
                this.y = this.canvasHeight + this.radius;
                break;
            case 3: // 左边
                this.x = -this.radius;
                this.y = Math.random() * this.canvasHeight;
                break;
        }
    }
    
    /**
     * 更新怪物状态
     */
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // 追踪玩家
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * this.speed * deltaTime;
            this.y += (dy / distance) * this.speed * deltaTime;
        }
    }
    
    /**
     * 受到伤害
     */
    takeDamage(damage) {
        if (!this.isAlive) return;
        
        this.currentHp -= damage;
        
        if (this.currentHp <= 0) {
            this.die();
        }
    }
    
    /**
     * 怪物死亡
     */
    die() {
        this.isAlive = false;
        // 给予玩家金币
        const gold = randomInt(this.goldMin, this.goldMax);
        this.player.addGold(gold);
        this.player.addKill();
    }
    
    /**
     * 获取掉落金币数
     */
    getGoldDrop() {
        return randomInt(this.goldMin, this.goldMax);
    }
    
    /**
     * 绘制怪物
     */
    draw(ctx) {
        if (!this.isAlive) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 根据类型绘制不同的外观
        switch (this.type) {
            case 'goblin':
                this.drawGoblin(ctx);
                break;
            case 'bat':
                this.drawBat(ctx);
                break;
            case 'skeleton':
                this.drawSkeleton(ctx);
                break;
            case 'monster4':
                this.drawMonster4(ctx);
                break;
        }
        
        // 绘制血条
        this.drawHealthBar(ctx);
        
        ctx.restore();
    }
    
    /**
     * 绘制哥布林
     */
    drawGoblin(ctx) {
        const image = ImageManager.get('monster1');
        
        if (image) {
            // 使用图片绘制
            const size = this.radius * 2;
            ctx.drawImage(image, -this.radius, -this.radius, size, size);
        } else {
            // 如果图片加载失败，使用原绘制
            // 身体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 眼睛
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(-6, -5, 4, 0, Math.PI * 2);
            ctx.arc(6, -5, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // 瞳孔
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-6, -5, 2, 0, Math.PI * 2);
            ctx.arc(6, -5, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 耳朵
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-this.radius, -10);
            ctx.lineTo(-this.radius - 8, -20);
            ctx.lineTo(-this.radius + 5, -10);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(this.radius, -10);
            ctx.lineTo(this.radius + 8, -20);
            ctx.lineTo(this.radius - 5, -10);
            ctx.fill();
        }
    }
    
    /**
     * 绘制蝙蝠
     */
    drawBat(ctx) {
        const image = ImageManager.get('monster3');
        
        if (image) {
            // 使用图片绘制
            const size = this.radius * 2;
            ctx.drawImage(image, -this.radius, -this.radius, size, size);
        } else {
            // 如果图片加载失败，使用原绘制
            // 翅膀
            ctx.fillStyle = this.color;
            
            // 左翅膀
            ctx.beginPath();
            ctx.ellipse(-this.radius * 1.5, 0, this.radius, this.radius * 0.5, -0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 右翅膀
            ctx.beginPath();
            ctx.ellipse(this.radius * 1.5, 0, this.radius, this.radius * 0.5, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 身体
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            
            // 眼睛
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(-3, -2, 3, 0, Math.PI * 2);
            ctx.arc(3, -2, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * 绘制骷髅
     */
    drawSkeleton(ctx) {
        const image = ImageManager.get('monster2');
        
        if (image) {
            // 使用图片绘制
            const size = this.radius * 2;
            ctx.drawImage(image, -this.radius, -this.radius, size, size);
        } else {
            // 如果图片加载失败，使用原绘制
            // 头骨
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 眼睛洞
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.ellipse(-6, -3, 5, 7, 0, 0, Math.PI * 2);
            ctx.ellipse(6, -3, 5, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 鼻子
            ctx.beginPath();
            ctx.moveTo(0, 2);
            ctx.lineTo(-3, 8);
            ctx.lineTo(3, 8);
            ctx.closePath();
            ctx.fill();
            
            // 牙齿
            ctx.fillStyle = '#1a1a2e';
            for (let i = -8; i <= 8; i += 4) {
                ctx.fillRect(i, 10, 3, 5);
            }
        }
    }
    
    /**
     * 绘制妖怪4
     */
    drawMonster4(ctx) {
        const image = ImageManager.get('monster4');
        
        if (image) {
            // 使用图片绘制
            const size = this.radius * 2;
            ctx.drawImage(image, -this.radius, -this.radius, size, size);
        } else {
            // 如果图片加载失败，使用备用绘制
            // 身体
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // 眼睛
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-6, -4, 5, 0, Math.PI * 2);
            ctx.arc(6, -4, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // 瞳孔
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-6, -4, 2, 0, Math.PI * 2);
            ctx.arc(6, -4, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 嘴巴
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 4, 8, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }
    }
    
    /**
     * 绘制血条
     */
    drawHealthBar(ctx) {
        const barWidth = 50; // 血条变长一点
        const barHeight = 8; // 血条变厚
        const barX = -barWidth / 2;
        const barY = -this.radius - 14;
        
        // 背景
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 血量
        const hpPercent = this.currentHp / this.maxHp;
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
    }
}

export default Monster;

