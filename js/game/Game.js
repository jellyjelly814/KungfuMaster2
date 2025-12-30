/**
 * 游戏主类
 * 管理整个游戏的核心逻辑和循环
 */
import Player from './Player.js';
import Monster from './Monster.js';
import Tavern from './Tavern.js';
import UIManager from './UIManager.js';
import GoldDrop from './GoldDrop.js';
import MaotaiPurchase from './MaotaiPurchase.js';
import ImageManager from '../utils/ImageManager.js';
import BossEasterEgg from './BossEasterEgg.js';
import GAME_CONFIG from '../utils/GameConfig.js';
import { checkCircleCollision, randomInt } from '../utils/Utils.js';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置画布大小
        canvas.width = 900;
        canvas.height = 700;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameWon = false;
        this.gameLost = false;
        
        // 游戏对象
        this.player = null;
        this.monsters = [];
        this.taverns = [];
        this.goldDrops = [];      // 金币掉落特效
        this.maotaiPurchases = []; // 茅台购买提示
        this.bossEasterEgg = new BossEasterEgg(); // Boss彩蛋
        this.tavernClickCount = 0; // 酒馆点击次数
        this.uiManager = new UIManager();
        
        // 游戏进度
        this.elapsedTime = 0; // 秒
        this.currentStage = 1;
        this.stageStartTime = 0;
        this.spawnTimer = 0;
        
        // 输入状态
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // 背景音乐
        this.bgmAudio = document.getElementById('bgm-audio');
        
        // 绑定事件
        this.bindEvents();
    }
    
    /**
     * 绑定输入事件
     */
    bindEvents() {
        // 键盘按下
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.keys.up = true;
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = true;
                    break;
                case 'arrowleft':
                case 'a':
                    this.keys.left = true;
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = true;
                    break;
            }
        });
        
        // 键盘释放
        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.keys.up = false;
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = false;
                    break;
                case 'arrowleft':
                case 'a':
                    this.keys.left = false;
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = false;
                    break;
            }
        });
        
        // 鼠标点击事件（用于酒馆彩蛋）
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 检查是否点击了酒馆
            this.taverns.forEach(tavern => {
                if (tavern.checkClick(mouseX, mouseY)) {
                    this.tavernClickCount++;
                    console.log(`酒馆点击次数: ${this.tavernClickCount}`);
                    
                    // 检查是否激活彩蛋（点击5次）
                    if (this.tavernClickCount >= 5) {
                        this.activateBossEasterEgg();
                        this.tavernClickCount = 0; // 重置计数
                    }
                }
            });
        });
        
        // 按钮事件
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('play-again-button').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    /**
     * 激活Boss彩蛋模式
     */
    activateBossEasterEgg() {
        console.log('🔥 BOSS 彩蛋模式激活！');
        this.bossEasterEgg.activate(this.canvas.width, this.canvas.height);
    }
    
    /**
     * 开始游戏
     */
    async startGame() {
        // 播放背景音乐
        if (this.bgmAudio) {
            this.bgmAudio.currentTime = 0;
            this.bgmAudio.play().catch(err => {
                console.log('背景音乐播放失败:', err);
            });
        }
        
        // 等待图片加载完成
        await ImageManager.loadAll();
        
        // 初始化玩家
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        await this.player.initWeapons();
        
        // 初始化酒馆
        this.initTaverns();
        
        // 初始化怪物数组
        this.monsters = [];
        
        // 初始化特效数组
        this.goldDrops = [];
        this.maotaiPurchases = [];
        
        // 重置彩蛋状态
        this.bossEasterEgg = new BossEasterEgg();
        this.tavernClickCount = 0;
        
        // 重置游戏状态
        this.isRunning = true;
        this.isPaused = false;
        this.gameWon = false;
        this.gameLost = false;
        this.elapsedTime = 0;
        this.currentStage = 1;
        this.stageStartTime = 0;
        this.spawnTimer = 0;
        
        // 隐藏UI
        this.uiManager.hideStartScreen();
        this.uiManager.hideGameOverScreen();
        this.uiManager.hideVictoryScreen();
        
        // 开始游戏循环
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * 重新开始游戏
     */
    async restartGame() {
        await this.startGame();
    }
    
    /**
     * 初始化酒馆
     */
    initTaverns() {
        this.taverns = [
            new Tavern('A', GAME_CONFIG.TAVERNS.POSITIONS.A.x, GAME_CONFIG.TAVERNS.POSITIONS.A.y),
            new Tavern('B', GAME_CONFIG.TAVERNS.POSITIONS.B.x, GAME_CONFIG.TAVERNS.POSITIONS.B.y),
            new Tavern('C', GAME_CONFIG.TAVERNS.POSITIONS.C.x, GAME_CONFIG.TAVERNS.POSITIONS.C.y)
        ];
    }
    
    /**
     * 游戏主循环
     */
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        // 计算deltaTime（秒）
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 限制最大deltaTime防止跳跃
        const cappedDeltaTime = Math.min(deltaTime, 0.1);
        
        if (!this.isPaused) {
            this.update(cappedDeltaTime);
            this.render();
        }
        
        // 继续循环
        if (this.isRunning) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    /**
     * 更新游戏状态
     */
    update(deltaTime) {
        // 更新游戏时间
        this.elapsedTime += deltaTime;
        
        // 检查是否通关
        if (this.elapsedTime >= GAME_CONFIG.TOTAL_GAME_TIME) {
            this.gameWon = true;
            this.isRunning = false;
            this.uiManager.showVictoryScreen(this.player);
            return;
        }
        
        // 更新关卡
        this.updateStage();
        
        // 更新玩家
        this.updatePlayer(deltaTime);
        
        // 生成怪物
        this.spawnMonster(deltaTime);
        
        // 更新怪物
        this.updateMonsters(deltaTime);
        
        // 更新酒馆
        this.updateTaverns(deltaTime);
        
        // 更新特效
        this.updateEffects(deltaTime);
        
        // 更新Boss彩蛋
        this.bossEasterEgg.update(deltaTime);
        
        // 应用彩蛋效果：武器转速加快10倍
        if (this.bossEasterEgg.isActive) {
            this.player.rotationSpeed = this.player.baseRotationSpeed * 10;
        } else {
            this.player.rotationSpeed = this.player.baseRotationSpeed;
        }
        
        // 检测碰撞
        this.checkCollisions();
        
        // 更新UI
        this.uiManager.updatePlayerUI(this.player, this.currentStage);
        this.uiManager.updateTimeDisplay(this.elapsedTime);
        this.uiManager.updateTavernUI(this.taverns, this.player);
        
        // 检查游戏结束
        if (!this.player.isAlive) {
            this.gameLost = true;
            this.isRunning = false;
            this.uiManager.showGameOverScreen(this.player, this.currentStage);
        }
    }
    
    /**
     * 更新关卡
     */
    updateStage() {
        const newStage = Math.floor(this.elapsedTime / GAME_CONFIG.STAGE_DURATION) + 1;
        
        if (newStage > this.currentStage && newStage <= GAME_CONFIG.TOTAL_STAGES) {
            this.currentStage = newStage;
            // 可以在这里添加关卡切换效果
        }
    }
    
    /**
     * 更新玩家
     */
    updatePlayer(deltaTime) {
        // 计算移动方向
        let dirX = 0;
        let dirY = 0;
        
        if (this.keys.up) dirY -= 1;
        if (this.keys.down) dirY += 1;
        if (this.keys.left) dirX -= 1;
        if (this.keys.right) dirX += 1;
        
        this.player.setDirection(dirX, dirY);
        this.player.update(deltaTime, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 生成怪物
     */
    spawnMonster(deltaTime) {
        this.spawnTimer += deltaTime;
        
        // 计算当前关卡的生成率
        const difficultyMultiplier = Math.pow(
            GAME_CONFIG.DIFFICULTY.SPAWN_RATE_MULTIPLIER, 
            this.currentStage - 1
        );
        
        // 应用Boss彩蛋倍率
        const bossMultiplier = this.bossEasterEgg.getSpeedMultiplier();
        const spawnInterval = 1 / (GAME_CONFIG.DIFFICULTY.BASE_SPAWN_RATE * difficultyMultiplier * bossMultiplier);
        
        if (this.spawnTimer >= spawnInterval) {
            this.spawnTimer = 0;
            
            // 随机选择怪物类型
            const monsterTypes = ['goblin', 'bat', 'skeleton', 'monster4'];
            const type = monsterTypes[randomInt(0, 3)];
            
            // 创建怪物
            const monster = new Monster(type, this.canvas.width, this.canvas.height, this.player);
            this.monsters.push(monster);
        }
    }
    
    /**
     * 更新怪物
     */
    updateMonsters(deltaTime) {
        // 更新所有怪物
        this.monsters.forEach(monster => {
            monster.update(deltaTime);
        });
        
        // 移除死亡怪物
        this.monsters = this.monsters.filter(monster => monster.isAlive);
        
        // 限制最大怪物数量（性能优化）
        if (this.monsters.length > 100) {
            this.monsters = this.monsters.slice(-100);
        }
    }
    
    /**
     * 更新酒馆
     */
    updateTaverns(deltaTime) {
        this.taverns.forEach(tavern => {
            tavern.update(deltaTime);
        });
    }
    
    /**
     * 更新特效
     */
    updateEffects(deltaTime) {
        // 更新金币掉落
        this.goldDrops.forEach(drop => {
            drop.update(deltaTime);
        });
        // 移除过期的金币掉落
        this.goldDrops = this.goldDrops.filter(drop => !drop.isExpired());
        
        // 更新茅台购买提示
        this.maotaiPurchases.forEach(purchase => {
            purchase.update(deltaTime);
        });
        // 移除过期的茅台购买提示
        this.maotaiPurchases = this.maotaiPurchases.filter(purchase => !purchase.isExpired());
    }
    
    /**
     * 检测碰撞
     */
    checkCollisions() {
        // 武器vs怪物碰撞
        this.player.weapons.forEach(weapon => {
            this.monsters.forEach(monster => {
                if (weapon.isActive && monster.isAlive) {
                    if (checkCircleCollision(weapon, monster)) {
                        // 添加攻击冷却，防止一次攻击多次判定
                        if (!weapon.cooldownTimer) {
                            weapon.cooldownTimer = 0;
                        }
                        
                        if (weapon.cooldownTimer <= 0) {
                            monster.takeDamage(weapon.damage);
                            weapon.cooldownTimer = 0.1; // 100ms冷却
                            
                            if (!monster.isAlive) {
                                // 怪物死亡，给予经验
                                this.player.gainExp(1);
                                // 添加金币掉落特效
                                const gold = monster.getGoldDrop();
                                this.goldDrops.push(new GoldDrop(monster.x, monster.y, gold));
                            }
                        }
                    }
                }
                
                // 更新武器冷却
                if (weapon.cooldownTimer > 0) {
                    weapon.cooldownTimer -= 1/60; // 假设60fps
                }
            });
        });
        
        // 玩家vs怪物碰撞
        this.monsters.forEach(monster => {
            if (monster.isAlive) {
                if (checkCircleCollision(this.player, monster)) {
                    this.player.takeDamage(monster.damage);
                }
            }
        });
        
        // 玩家vs酒馆碰撞（自动购买）
        this.taverns.forEach(tavern => {
            if (tavern.isPlayerInRange(this.player)) {
                if (tavern.tryPurchase(this.player)) {
                    // 购买成功，添加提示特效
                    this.maotaiPurchases.push(
                        new MaotaiPurchase(tavern.x, tavern.y - 50, tavern.healAmount)
                    );
                }
            }
        });
    }
    
    /**
     * 渲染游戏画面
     */
    render() {
        // 清空画布
        this.ctx.fillStyle = '#2d2d44';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景网格
        this.drawBackground();
        
        // 绘制酒馆
        this.taverns.forEach(tavern => {
            tavern.draw(this.ctx, this.player);
        });
        
        // 绘制怪物
        this.monsters.forEach(monster => {
            monster.draw(this.ctx);
        });
        
        // 绘制玩家
        this.player.draw(this.ctx);
        
        // 绘制金币掉落特效（在玩家之上）
        this.goldDrops.forEach(drop => {
            drop.draw(this.ctx);
        });
        
        // 绘制茅台购买提示（在最上层）
        this.maotaiPurchases.forEach(purchase => {
            purchase.draw(this.ctx);
        });
        
        // 绘制Boss彩蛋（在最顶层）
        this.bossEasterEgg.draw(this.ctx, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 绘制背景
     */
    drawBackground() {
        // 尝试绘制背景图片
        const backgroundImage = ImageManager.get('background');
        
        if (backgroundImage) {
            // 使用背景图片填充
            this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // 如果图片加载失败，使用深色背景
            this.ctx.fillStyle = '#2d2d44';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 绘制网格作为备选
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            this.ctx.lineWidth = 1;
            
            const gridSize = 50;
            
            for (let x = 0; x < this.canvas.width; x += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            
            for (let y = 0; y < this.canvas.height; y += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
    }
}

export default Game;

