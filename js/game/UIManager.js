/**
 * UI管理器
 * 管理所有游戏界面显示
 */
class UIManager {
    constructor() {
        // DOM元素引用
        this.hpDisplay = document.getElementById('hp-display');
        this.goldDisplay = document.getElementById('gold-display');
        this.weaponsDisplay = document.getElementById('weapons-display');
        this.levelDisplay = document.getElementById('level-display');
        this.killsDisplay = document.getElementById('kills-display');
        this.timeDisplay = document.getElementById('time-display');
        this.stageDisplay = document.getElementById('current-stage');
        
        // 酒馆元素
        this.tavernA = document.getElementById('tavern-a');
        this.tavernC = document.getElementById('tavern-c');
        
        // 屏幕元素
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.victoryScreen = document.getElementById('victory-screen');
        
        // 结束画面统计
        this.finalKills = document.getElementById('final-kills');
        this.finalGold = document.getElementById('final-gold');
        this.finalLevel = document.getElementById('final-level');
        this.finalStage = document.getElementById('final-stage');
        
        this.victoryKills = document.getElementById('victory-kills');
        this.victoryGold = document.getElementById('victory-gold');
        this.victoryLevel = document.getElementById('victory-level');
    }
    
    /**
     * 更新玩家状态显示
     */
    updatePlayerUI(player, stage) {
        this.hpDisplay.textContent = `${player.currentHp}/${player.maxHp}`;
        this.goldDisplay.textContent = player.gold;
        this.weaponsDisplay.textContent = `${player.weaponsCount}/12`;
        this.levelDisplay.textContent = `Lv.${player.level}`;
        this.killsDisplay.textContent = player.killCount;
        this.stageDisplay.textContent = `第 ${stage} 关`;
        
        // 根据血量改变颜色
        const hpPercent = player.currentHp / player.maxHp;
        if (hpPercent > 0.5) {
            this.hpDisplay.style.color = '#2ed573';
        } else if (hpPercent > 0.25) {
            this.hpDisplay.style.color = '#ffa502';
        } else {
            this.hpDisplay.style.color = '#ff4757';
        }
    }
    
    /**
     * 更新时间显示
     */
    updateTimeDisplay(elapsedTime) {
        const remainingTime = 1200 - elapsedTime; // 总共20分钟
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        this.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * 更新酒馆状态显示
     */
    updateTavernUI(taverns, player) {
        // 检查酒馆A
        const tavernA = taverns.find(t => t.id === 'A');
        if (tavernA && tavernA.canPurchase(player)) {
            this.tavernA.classList.add('purchasable');
        } else {
            this.tavernA.classList.remove('purchasable');
        }
        
        // 检查酒馆C
        const tavernC = taverns.find(t => t.id === 'C');
        if (tavernC && tavernC.canPurchase(player)) {
            this.tavernC.classList.add('purchasable');
        } else {
            this.tavernC.classList.remove('purchasable');
        }
    }
    
    /**
     * 显示开始界面
     */
    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.victoryScreen.classList.add('hidden');
    }
    
    /**
     * 隐藏开始界面
     */
    hideStartScreen() {
        this.startScreen.classList.add('hidden');
    }
    
    /**
     * 显示游戏结束界面
     */
    showGameOverScreen(player, stage) {
        this.finalKills.textContent = player.killCount;
        this.finalGold.textContent = player.gold;
        this.finalLevel.textContent = player.level;
        this.finalStage.textContent = `${stage}/10`;
        
        this.gameOverScreen.classList.remove('hidden');
    }
    
    /**
     * 隐藏游戏结束界面
     */
    hideGameOverScreen() {
        this.gameOverScreen.classList.add('hidden');
    }
    
    /**
     * 显示通关界面
     */
    showVictoryScreen(player) {
        this.victoryKills.textContent = player.killCount;
        this.victoryGold.textContent = player.gold;
        this.victoryLevel.textContent = player.level;
        
        this.victoryScreen.classList.remove('hidden');
    }
    
    /**
     * 隐藏通关界面
     */
    hideVictoryScreen() {
        this.victoryScreen.classList.add('hidden');
    }
    
    /**
     * 重置所有界面
     */
    reset() {
        this.showStartScreen();
    }
}

export default UIManager;

