/**
 * 玩家类
 * 管理武僧主角的所有状态和行为
 */
import GAME_CONFIG from '../utils/GameConfig.js';
import ImageManager from '../utils/ImageManager.js';

class Player {
    constructor(x, y) {
        // 基础属性
        this.x = x;
        this.y = y;
        this.radius = GAME_CONFIG.PLAYER.SIZE;
        this.moveSpeed = GAME_CONFIG.PLAYER.MOVE_SPEED;
        
        // 血量系统
        this.currentHp = GAME_CONFIG.PLAYER.START_HP;
        this.maxHp = GAME_CONFIG.PLAYER.MAX_HP;
        this.damagePerHit = GAME_CONFIG.PLAYER.DAMAGE_PER_HIT;
        
        // 等级系统
        this.level = 1;
        this.currentExp = 0;
        this.expToNextLevel = GAME_CONFIG.LEVELING.START_EXP_REQUIRED;
        
        // 武器系统
        this.weaponsCount = GAME_CONFIG.PLAYER.START_WEAPONS;
        this.baseRotationSpeed = GAME_CONFIG.PLAYER.START_ROTATION_SPEED;
        this.rotationSpeed = this.baseRotationSpeed;
        this.weapons = [];
        
        // 经济和战绩
        this.gold = 0;
        this.killCount = 0;
        
        // 无敌时间（缩短到0.1秒）
        this.invincibleTime = 0;
        this.INVINCIBLE_DURATION = 0.1;
        
        // 状态
        this.isAlive = true;
        
        // 移动方向
        this.direction = { x: 0, y: 0 };
    }
    
    /**
     * 初始化武器
     */
    async initWeapons() {
        this.weapons = [];
        // 动态导入Weapon类
        const WeaponModule = await import('./Weapon.js');
        const Weapon = WeaponModule.default;
        
        for (let i = 0; i < this.weaponsCount; i++) {
            const angle = (i / this.weaponsCount) * 2 * Math.PI;
            const weapon = new Weapon(i, angle, this);
            this.weapons.push(weapon);
        }
    }
    
    /**
     * 设置移动方向
     */
    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
        
        // 标准化方向向量
        const length = Math.sqrt(x * x + y * y);
        if (length > 0) {
            this.direction.x /= length;
            this.direction.y /= length;
        }
    }
    
    /**
     * 更新玩家状态
     */
    update(deltaTime, canvasWidth, canvasHeight) {
        if (!this.isAlive) return;
        
        // 更新无敌时间
        if (this.invincibleTime > 0) {
            this.invincibleTime -= deltaTime;
        }
        
        // 移动
        this.x += this.direction.x * this.moveSpeed * deltaTime;
        this.y += this.direction.y * this.moveSpeed * deltaTime;
        
        // 边界检测
        this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));
        
        // 更新武器
        this.weapons.forEach(weapon => {
            weapon.rotationSpeed = this.rotationSpeed;
            weapon.update(deltaTime);
        });
    }
    
    /**
     * 玩家受伤
     */
    takeDamage(damage) {
        if (!this.isAlive) return;
        
        // 检查是否处于无敌时间
        if (this.invincibleTime > 0) return;
        
        this.currentHp -= damage;
        this.invincibleTime = this.INVINCIBLE_DURATION; // 触发无敌时间
        
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.isAlive = false;
        }
    }
    
    /**
     * 玩家回血
     */
    heal(amount) {
        this.currentHp += amount;
        if (this.currentHp > this.maxHp) {
            this.currentHp = this.maxHp;
        }
    }
    
    /**
     * 获得经验
     */
    gainExp(amount) {
        this.currentExp += amount;
        
        // 检查是否升级
        while (this.currentExp >= this.expToNextLevel) {
            this.levelUp();
        }
    }
    
    /**
     * 升级
     */
    levelUp() {
        this.currentExp -= this.expToNextLevel;
        this.level++;
        
        // 提升旋转速度
        this.baseRotationSpeed += GAME_CONFIG.PLAYER.SPEED_INCREASE_PER_LEVEL;
        this.rotationSpeed = this.baseRotationSpeed;
        
        // 检查是否解锁新武器
        if (this.level % GAME_CONFIG.PLAYER.WEAPONS_UNLOCK_INTERVAL === 0) {
            if (this.weaponsCount < GAME_CONFIG.PLAYER.MAX_WEAPONS) {
                this.addWeapon();
            }
        }
        
        // 更新下一级所需经验
        this.expToNextLevel = GAME_CONFIG.LEVELING.START_EXP_REQUIRED + 
                              (this.level - 1) * GAME_CONFIG.LEVELING.EXP_INCREASE_PER_LEVEL;
    }
    
    /**
     * 添加新武器
     */
    async addWeapon() {
        if (this.weaponsCount >= GAME_CONFIG.PLAYER.MAX_WEAPONS) return;
        
        this.weaponsCount++;
        
        // 重新分配所有武器的角度
        this.weapons.forEach((weapon, index) => {
            weapon.angle = (index / this.weaponsCount) * 2 * Math.PI;
        });
        
        // 添加新武器
        const newAngle = ((this.weaponsCount - 1) / this.weaponsCount) * 2 * Math.PI;
        const WeaponModule = await import('./Weapon.js');
        const Weapon = WeaponModule.default;
        const newWeapon = new Weapon(this.weaponsCount - 1, newAngle, this);
        this.weapons.push(newWeapon);
    }
    
    /**
     * 获得金币
     */
    addGold(amount) {
        this.gold += amount;
    }
    
    /**
     * 增加击杀数
     */
    addKill() {
        this.killCount++;
    }
    
    /**
     * 绘制玩家
     */
    draw(ctx) {
        if (!this.isAlive) return;
        
        // 无敌状态闪烁效果
        if (this.invincibleTime > 0) {
            const blinkRate = 10; // 闪烁频率
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.globalAlpha = 0.5; // 半透明
            }
        }
        
        // 尝试使用武僧图片
        const playerImage = ImageManager.get('player');
        
        if (playerImage) {
            // 使用图片绘制（考虑无敌闪烁）
            const size = this.radius * 3; // 放大一点
            ctx.drawImage(playerImage, this.x - this.radius * 1.5, this.y - this.radius * 1.5, size, size);
        } else {
            // 如果图片加载失败，使用原绘制
            // 绘制身体
            ctx.fillStyle = '#ff6b6b'; // 武僧衣服颜色
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 3;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // 绘制头部
            ctx.fillStyle = '#ffeaa7'; // 肤色
            ctx.beginPath();
            ctx.arc(this.x, this.y - 8, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制光头效果
            ctx.fillStyle = '#2d3436';
            ctx.beginPath();
            ctx.arc(this.x, this.y - 12, 8, Math.PI, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制等级
        this.drawLevel(ctx);
        
        // 绘制武器
        this.drawWeapons(ctx);
        
        // 绘制血条
        this.drawHealthBar(ctx);
        
        // 恢复透明度
        ctx.globalAlpha = 1.0;
    }
    
    /**
     * 绘制等级
     */
    drawLevel(ctx) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Lv.${this.level}`, this.x, this.y + this.radius + 20);
    }
    
    /**
     * 绘制武器
     */
    drawWeapons(ctx) {
        // 根据武器数量调整显示大小
        const scale = 1;
        
        this.weapons.forEach(weapon => {
            ctx.save();
            ctx.scale(scale, scale);
            weapon.draw(ctx);
            ctx.restore();
        });
    }
    
    /**
     * 绘制血条
     */
    drawHealthBar(ctx) {
        const barWidth = 60;
        const barHeight = 8;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 20;
        
        // 背景
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 血量
        const hpPercent = this.currentHp / this.maxHp;
        ctx.fillStyle = hpPercent > 0.5 ? '#2ed573' : hpPercent > 0.25 ? '#ffa502' : '#ff4757';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        
        // 边框
        ctx.strokeStyle = '#636e72';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

export default Player;

