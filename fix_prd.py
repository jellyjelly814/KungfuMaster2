#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复PRD.md中的怪物类型格式
"""

# 读取文件
with open('/Users/minimax/Desktop/KungfuMaster/PRD.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复格式问题
# 1. 删除重复的标题行
content = content.replace('#### 2.4 敌人系统\n\n#### 2.4 敌人系统\n', '#### 2.4 敌人系统\n')

# 2. 修复表格格式（删除多余的 |）
content = content.replace('||**4种怪物类型**：', '|**4种怪物类型**：')
content = content.replace('||| 怪物类型 |', '|| 怪物类型 |')
content = content.replace('|||---------|', '||---------|')
content = content.replace('||| 哥布林 |', '|| 哥布林 |')
content = content.replace('||| 蝙蝠 |', '|| 蝙蝠 |')
content = content.replace('||| 骷髅 |', '|| 骷髅 |')
content = content.replace('||| 妖怪4 |', '|| 妖怪4 |')

# 写回文件
with open('/Users/minimax/Desktop/KungfuMaster/PRD.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ PRD.md 格式已修复！")

