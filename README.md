# 日程管理 App Demo

## 项目简介
这是一个基于 SwiftUI + SwiftData 的 iOS 日程管理 App，包含四个主要页面：
- **A页面**：周视图 + Todo库（支持拖拽安排）
- **B页面**：月视图（日历形式展示已完成的Todo）
- **C页面**：Todo库管理（分类管理 + 详细编辑）
- **D页面**：日记功能（今日小结 + 完成记录 + 备注）

## 环境要求
- Xcode 15.0+
- iOS 17.0+（SwiftData 需要 iOS 17+）
- Swift 5.9+

## 创建 Xcode 项目步骤

1. 打开 Xcode，选择 **File → New → Project**
2. 选择 **iOS → App**，点击 Next
3. 填写项目信息：
   - Product Name: `ScheduleApp`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Storage: **SwiftData**
4. 点击 Next，选择保存位置
5. 将本目录下的所有 `.swift` 文件拖入 Xcode 项目中
   - 确保勾选 "Copy items if needed"
   - Target 选择 ScheduleApp
6. 删除 Xcode 自动生成的 `ContentView.swift` 和 `ScheduleAppApp.swift`（已被本项目的版本覆盖）

## 文件说明

| 文件 | 说明 |
|------|------|
| `ScheduleAppApp.swift` | App 入口，配置 TabView 和 SwiftData 容器 |
| `Models.swift` | 数据模型（TodoItem, TodoCategory, DiaryEntry, DayPlan） |
| `WeekViewPage.swift` | A页面：周视图 + 右侧 Todo 面板 + 拖拽功能 |
| `MonthViewPage.swift` | B页面：月视图日历，显示每日已完成 Todo |
| `TodoLibraryPage.swift` | C页面：分类管理 + Todo 详细编辑 |
| `DiaryPage.swift` | D页面：日记视图 + 月记视图切换 |
| `Extensions.swift` | 配色方案和日期工具扩展 |

## 功能特性

### 数据互通
- A、B、C 三个页面共享同一份 Todo 数据（通过 SwiftData 自动同步）
- D 页面自动读取当天完成的 Todo 并展示

### A页面功能
- 左侧周视图显示每天的计划事项
- 右侧 Todo 库支持按分类浏览
- 可将 Todo 拖拽到周视图的某一天进行安排
- 支持新增分类和 Todo

### B页面功能
- 月历网格展示
- 每个日期格显示当天已完成的 Todo（最多显示2条 + 计数）
- 点击日期查看详细完成列表

### C页面功能
- 左侧分类列表，支持添加/编辑/删除分类
- 右侧显示选中分类下的所有 Todo
- 支持添加/编辑/删除 Todo
- 支持标记完成状态和查看计划日期

### D页面功能
- 日记视图：今日小结（一句话）+ 已完成 Todo 列表 + 备注
- 月记视图：按月列出每日小结，点击跳转详情
- 支持日历选择器切换日期

## 配色方案
- 主色调：浅蓝色 `rgb(102, 179, 230)`
- 背景色：浅白蓝 `rgb(247, 250, 255)`
- 风格：简洁、清凉

## 后续扩展
- 当前版本使用本地存储（SwiftData）
- 架构预留了云端同步扩展点
- 账号系统可在后续版本中添加
