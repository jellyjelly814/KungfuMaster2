/**
 * 游戏入口文件
 * 初始化游戏并启动
 */

import Game from './game/Game.js';

// 获取画布元素
const canvas = document.getElementById('game-canvas');

// 创建游戏实例
const game = new Game(canvas);

// 显示开始界面
game.uiManager.showStartScreen();

console.log('🎮 KungfuMaster 游戏已加载！');
console.log('使用方向键或WASD移动武僧，消灭怪物，坚持20分钟通关！');

