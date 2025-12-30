/**
 * 工具函数集合
 */

/**
 * 计算两点之间的距离
 */
export function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 检查两个圆形是否碰撞
 */
export function checkCircleCollision(obj1, obj2) {
    const distance = getDistance(obj1.x, obj1.y, obj2.x, obj2.y);
    return distance <= (obj1.radius + obj2.radius);
}

/**
 * 将角度转换为弧度
 */
export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * 格式化时间（秒 -> MM:SS）
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 获取范围内的随机整数
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取范围内的随机浮点数
 */
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 限制数值在范围内
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * 检查点是否在矩形内
 */
export function isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
}

/**
 * 计算两个物体之间的角度
 */
export function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 根据角度和距离计算目标位置
 */
export function getPositionFromAngle(startX, startY, angle, distance) {
    return {
        x: startX + Math.cos(angle) * distance,
        y: startY + Math.sin(angle) * distance
    };
}

