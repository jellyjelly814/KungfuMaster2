/**
 * 游戏配置常量
 * 包含所有游戏平衡性参数和配置
 */

const GAME_CONFIG = {
    // 游戏设置
    TOTAL_STAGES: 10,
    STAGE_DURATION: 120, // 秒
    TOTAL_GAME_TIME: 1200, // 秒
    
    // 玩家设置
    PLAYER: {
        START_HP: 100,
        MAX_HP: 100,
        DAMAGE_PER_HIT: 10,
        START_WEAPONS: 3,        // 初始3把剑
        MAX_WEAPONS: 6,          // 最多6把剑
        START_ROTATION_SPEED: 0.3, // 圈/秒
        SPEED_INCREASE_PER_LEVEL: 0.05, // 每级增长5%
        WEAPONS_UNLOCK_INTERVAL: 5, // 每5级解锁1把剑
        SIZE: 25, // 玩家半径（缩小）
        MOVE_SPEED: 200, // 像素/秒
    },
    
    // 武器设置
    WEAPON: {
        DAMAGE: 10,
        DISTANCE: 45, // 攻击范围变小
        ROTATION_DIRECTION: 1, // 1: 顺时针
        SIZE: 15, // 短剑像素变小
    },
    
    // 怪物设置
    MONSTERS: {
        GOBLIN: { 
            HP: 12,  // 血条变厚
            DAMAGE: 8, // 伤害增加
            SPEED: 170, // 像素/秒（加快）
            GOLD_MIN: 1, 
            GOLD_MAX: 3, // 随机1～3枚
            SIZE: 22,   // 调大
            COLOR: '#4ade80', // 绿色
        },
        BAT: { 
            HP: 10,  // 血条变厚
            DAMAGE: 8, // 伤害增加
            SPEED: 180, // 像素/秒
            GOLD_MIN: 1, 
            GOLD_MAX: 3, // 随机1～3枚
            SIZE: 18,   // 调大
            COLOR: '#1f2937', // 黑色
        },
        SKELETON: { 
            HP: 25,  // 血条变厚
            DAMAGE: 8, // 伤害增加
            SPEED: 160, // 像素/秒（加快）
            GOLD_MIN: 1, 
            GOLD_MAX: 3, // 随机1～3枚
            SIZE: 26,   // 调大
            COLOR: '#f3f4f6', // 白色
        },
        MONSTER4: {
            HP: 15,
            DAMAGE: 10,
            SPEED: 190, // 移动速度快（比蝙蝠快）
            GOLD_MIN: 1,
            GOLD_MAX: 3, // 随机1～3枚
            SIZE: 20,
            COLOR: '#ff6b6b', // 红色
        },
    },
    
    // 经济设置
    ECONOMY: {
        MAOTAI_PRICE: 50,
        MAOTAI_HEAL: 50,
        HEAL_THRESHOLD: 50, // 血量<50才可购买
    },
    
    // 升级设置
    LEVELING: {
        START_EXP_REQUIRED: 30,
        EXP_INCREASE_PER_LEVEL: 50, // 每级递增50只怪
    },
    
    // 酒馆设置
    TAVERNS: {
        INTERACTION_RANGE: 60,
        POSITIONS: {
            A: { x: 150, y: 150 },      // 向内移动
            B: { x: 750, y: 150 },      // 向内移动
            C: { x: 450, y: 550 },      // 向上移动，不贴底边
        },
    },
    
    // 难度曲线（每关生成率倍率）
    DIFFICULTY: {
        SPAWN_RATE_MULTIPLIER: 1.25, // 每关增加25%生成率（提高）
        BASE_SPAWN_RATE: 2.0, // 基础生成率（怪/秒，提高）
    },
};

export default GAME_CONFIG;

