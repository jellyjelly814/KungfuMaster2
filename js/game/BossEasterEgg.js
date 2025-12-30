/**
 * Boss彩蛋管理类
 * 处理狂野模式的显示和效果
 */
import ImageManager from '../utils/ImageManager.js';

class BossEasterEgg {
    constructor() {
        this.isActive = false;
        this.bossImage = null;
        
        // 第1阶段：右下角小弹窗
        this.showSmallPopup = false;
        this.smallPopupTimer = 0;
        this.smallPopupDuration = 1000; // 1秒
        this.smallPopupWidth = 250;     // 250像素
        this.smallPopupHeight = 250;    // 250像素
        
        // 第2阶段：狂野模式主效果
        this.showMainMode = false;
        this.mainModeTimer = 0;
        this.mainModeDuration = 10000; // 10秒
        
        // 动画属性
        this.pulseScale = 1;
    }
    
    /**
     * 激活狂野模式
     */
    activate(canvasWidth, canvasHeight) {
        this.isActive = true;
        
        // 第1阶段：右下角小弹窗
        this.showSmallPopup = true;
        this.smallPopupTimer = 0;
        
        // 加载boss图片
        this.bossImage = ImageManager.get('boss');
        
        console.log('🔥 狂野模式已激活！');
    }
    
    /**
     * 更新状态
     */
    update(deltaTime) {
        if (!this.isActive) return false;
        
        // 第1阶段：右下角小弹窗（1秒）
        if (this.showSmallPopup) {
            this.smallPopupTimer += deltaTime * 1000;
            
            // 1秒后进入第2阶段
            if (this.smallPopupTimer >= this.smallPopupDuration) {
                this.showSmallPopup = false;
                this.showMainMode = true;
                this.mainModeTimer = 0;
                console.log('进入狂野模式主阶段');
            }
        }
        
        // 第2阶段：狂野模式主效果（10秒）
        if (this.showMainMode) {
            this.mainModeTimer += deltaTime * 1000;
            
            // 10秒后结束
            if (this.mainModeTimer >= this.mainModeDuration) {
                this.deactivate();
                return true; // 返回true表示彩蛋结束
            }
            
            // 脉冲动画效果
            this.pulseScale = 1 + Math.sin(this.mainModeTimer / 200) * 0.05;
        }
        
        return false;
    }
    
    /**
     * 绘制狂野模式
     */
    draw(ctx, canvasWidth, canvasHeight) {
        if (!this.isActive) return;
        
        // 第1阶段：右下角小弹窗
        if (this.showSmallPopup && this.smallPopupTimer < this.smallPopupDuration) {
            this.drawSmallPopup(ctx, canvasWidth, canvasHeight);
        }
        
        // 第2阶段：狂野模式主效果
        if (this.showMainMode) {
            this.drawMainMode(ctx, canvasWidth, canvasHeight);
        }
    }
    
    /**
     * 绘制第1阶段：右下角小弹窗
     */
    drawSmallPopup(ctx, canvasWidth, canvasHeight) {
        ctx.save();
        
        // 位置：右下角（103.6 x 175像素）
        const x = canvasWidth - this.smallPopupWidth - 20;
        const y = canvasHeight - this.smallPopupHeight - 20;
        
        // 金色边框（4px）
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
        
        // 显示boss.png
        const bossImg = ImageManager.get('boss');
        if (bossImg) {
            ctx.drawImage(
                bossImg, 
                x, 
                y, 
                this.smallPopupWidth, 
                this.smallPopupHeight
            );
        } else {
            // 备用：绘制金色边框矩形
            ctx.strokeRect(x, y, this.smallPopupWidth, this.smallPopupHeight);
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BOSS', x + this.smallPopupWidth/2, y + this.smallPopupHeight/2);
        }
        
        ctx.restore();
    }
    
    /**
     * 绘制第2阶段：狂野模式主效果
     */
    drawMainMode(ctx, canvasWidth, canvasHeight) {
        ctx.save();
        
        // 全屏红色滤镜：10%透明度
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // 中央脉冲文字："🔥 狂野模式 🔥"
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.scale(this.pulseScale, this.pulseScale);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔥 狂野模式 🔥', 0, 0);
        
        // 倒计时：10秒
        const remainingTime = Math.ceil((this.mainModeDuration - this.mainModeTimer) / 1000);
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${remainingTime}秒`, 0, 60);
        
        ctx.restore();
    }
    
    /**
     * 获取倍率（第2阶段10倍加速）
     */
    getSpeedMultiplier() {
        return (this.isActive && this.showMainMode) ? 10 : 1;
    }
    
    /**
     * 停用狂野模式
     */
    deactivate() {
        this.isActive = false;
        this.showSmallPopup = false;
        this.showMainMode = false;
        this.smallPopupTimer = 0;
        this.mainModeTimer = 0;
        console.log('狂野模式结束！');
    }
}

export default BossEasterEgg;
