# 工作记录网站

一个功能完整的个人工作记录管理网站，支持项目分类、标签系统、搜索筛选、GitHub同步等功能。

## 功能特点

### 📝 记录管理
- 添加、编辑、删除工作记录
- 支持设置重要程度标记
- 按日期自动排序显示
- 支持富文本内容

### 📁 项目分类
- 创建和管理多个项目
- 为每个项目分配不同颜色
- 按项目筛选和查看记录

### 🏷️ 标签系统
- 创建和管理自定义标签
- 为记录添加多个标签
- 按标签筛选和查看记录

### 🔍 搜索筛选
- 实时搜索记录标题和内容
- 支持按视图（全部、今日、本周、本月）筛选
- 结合项目和标签进行组合筛选

### 📱 响应式设计
- 适配桌面端和移动端
- 现代化的UI设计
- 流畅的动画效果

### 🐙 GitHub同步
- 将工作记录导出为Markdown格式
- 支持同步到GitHub仓库
- 可配置同步路径和分支

## 技术栈

- **HTML5** - 网站结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互功能
- **LocalStorage** - 本地数据存储
- **GitHub Pages** - 网站部署

## 快速开始

### 1. 克隆或下载项目

将项目文件下载到本地目录：

```bash
git clone https://github.com/yourusername/worklog.git
cd worklog
```

或者直接下载ZIP文件并解压。

### 2. 打开网站

直接在浏览器中打开 `index.html` 文件即可使用：

```bash
# 在Windows上
start index.html

# 在macOS上
open index.html

# 在Linux上
xdg-open index.html
```

### 3. 部署到GitHub Pages

#### 步骤1: 创建GitHub仓库

1. 登录GitHub账号
2. 点击右上角的"+", 选择"New repository"
3. 输入仓库名称（如：worklog）
4. 选择仓库可见性（公开或私有）
5. 点击"Create repository"

#### 步骤2: 初始化Git仓库

在项目目录中执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"
```

#### 步骤3: 关联GitHub仓库

```bash
# 关联远程仓库
git remote add origin https://github.com/yourusername/worklog.git

# 推送到GitHub
git push -u origin main
```

#### 步骤4: 启用GitHub Pages

1. 进入GitHub仓库页面
2. 点击"Settings"选项卡
3. 向下滚动到"GitHub Pages"部分
4. 在"Source"下拉菜单中选择分支（通常是main或master）
5. 点击"Save"按钮
6. 等待几分钟，您的网站将在 `https://yourusername.github.io/worklog/` 上可用

## 使用指南

### 添加工作记录

1. 点击右上角的"添加记录"按钮
2. 填写记录标题和内容
3. 选择项目和标签
4. 设置重要程度（可选）
5. 点击"保存"按钮

### 管理项目

1. 在左侧边栏点击"添加项目"按钮
2. 输入项目名称
3. 选择项目颜色
4. 点击"保存"按钮

### 管理标签

1. 在左侧边栏点击"添加标签"按钮
2. 输入标签名称
3. 点击"保存"按钮

### 筛选记录

- **按视图筛选**：点击左侧边栏的"全部"、"今日"、"本周"、"本月"按钮
- **按项目筛选**：点击左侧边栏的项目名称
- **按标签筛选**：点击左侧边栏的标签名称
- **搜索筛选**：在顶部搜索框中输入关键词

### GitHub同步

1. 在左侧边栏底部点击"GitHub设置"
2. 输入GitHub访问令牌、仓库名称、分支和路径
3. 点击"保存配置"
4. 点击"同步到GitHub"按钮

## 数据存储

所有数据都存储在浏览器的LocalStorage中，确保数据在本地安全保存。GitHub同步功能会将数据导出为Markdown格式并保存到GitHub仓库。

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 自定义配置

### 修改网站标题

编辑 `index.html` 文件中的 `<title>` 标签：

```html
<title>工作记录</title>
```

### 修改主题颜色

编辑 `style.css` 文件中的CSS变量：

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --accent-color: #e74c3c;
}
```

### 添加新功能

所有JavaScript代码都在 `script.js` 文件中，您可以根据需要添加或修改功能。

## 更新日志

### v1.0.0
- 初始版本
- 实现基本的记录管理功能
- 支持项目分类和标签系统
- 添加搜索筛选功能
- 实现GitHub同步功能
- 响应式设计

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如果您有任何问题或建议，请随时联系我。

---

**Created by MiniMax Agent**