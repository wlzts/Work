// 全局变量
let currentView = 'all';
let currentProject = null;
let currentTag = null;
let currentSearch = '';
let records = [];
let projects = [];
let tags = [];
let githubConfig = {
    accessToken: '',
    repo: '',
    branch: 'main',
    path: 'worklog'
};

// DOM元素
const addRecordBtn = document.getElementById('add-record-btn');
const searchInput = document.getElementById('search-input');
const recordsList = document.getElementById('records-list');
const recordCount = document.getElementById('record-count');

// 模态框元素
const recordModal = document.getElementById('record-modal');
const recordForm = document.getElementById('record-form');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const tagModal = document.getElementById('tag-modal');
const tagForm = document.getElementById('tag-form');
const githubModal = document.getElementById('github-modal');
const githubForm = document.getElementById('github-form');

// 模态框按钮
const closeButtons = document.querySelectorAll('.close-btn');
const cancelButtons = document.querySelectorAll('.cancel-btn');

// 初始化
function init() {
    // 加载数据
    loadData();
    
    // 绑定事件
    bindEvents();
    
    // 渲染界面
    renderAll();
    
    // 初始化MiniMax浮动球
    initMiniMaxBall();
}

// 加载数据
function loadData() {
    // 从localStorage加载数据
    const savedRecords = localStorage.getItem('worklog-records');
    const savedProjects = localStorage.getItem('worklog-projects');
    const savedTags = localStorage.getItem('worklog-tags');
    const savedGithubConfig = localStorage.getItem('worklog-github-config');
    
    records = savedRecords ? JSON.parse(savedRecords) : [];
    projects = savedProjects ? JSON.parse(savedProjects) : [];
    tags = savedTags ? JSON.parse(savedTags) : [];
    githubConfig = savedGithubConfig ? JSON.parse(savedGithubConfig) : githubConfig;
    
    // 如果没有项目，创建默认项目
    if (projects.length === 0) {
        projects.push({
            id: 'default',
            name: '默认项目',
            color: '#3498db'
        });
        saveData();
    }
}

// 保存数据
function saveData() {
    localStorage.setItem('worklog-records', JSON.stringify(records));
    localStorage.setItem('worklog-projects', JSON.stringify(projects));
    localStorage.setItem('worklog-tags', JSON.stringify(tags));
    localStorage.setItem('worklog-github-config', JSON.stringify(githubConfig));
}

// 绑定事件
function bindEvents() {
    // 添加记录按钮
    addRecordBtn.addEventListener('click', openRecordModal);
    
    // 搜索框
    searchInput.addEventListener('input', handleSearch);
    
    // 模态框关闭
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // 表单提交
    recordForm.addEventListener('submit', handleRecordSubmit);
    projectForm.addEventListener('submit', handleProjectSubmit);
    tagForm.addEventListener('submit', handleTagSubmit);
    githubForm.addEventListener('submit', handleGithubSubmit);
    
    // 视图切换
    const viewItems = document.querySelectorAll('.view-item');
    viewItems.forEach(item => {
        item.addEventListener('click', handleViewChange);
    });
    
    // GitHub同步按钮
    const syncBtn = document.getElementById('sync-btn');
    syncBtn.addEventListener('click', syncWithGithub);
    
    // 标签输入
    const tagInput = document.getElementById('tag-input');
    tagInput.addEventListener('keypress', handleTagInput);
    
    // 绑定项目和标签点击事件（动态生成，需要事件委托）
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-item')) {
            handleProjectChange(e.target.dataset.id);
        } else if (e.target.classList.contains('tag-item')) {
            handleTagChange(e.target.dataset.name);
        }
    });
}

// 渲染所有内容
function renderAll() {
    renderProjects();
    renderTags();
    renderRecords();
    renderGithubForm();
}

// 渲染项目列表
function renderProjects() {
    const projectsList = document.querySelector('.projects-list');
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const li = document.createElement('li');
        li.className = `project-item ${currentProject === project.id ? 'active' : ''}`;
        li.dataset.id = project.id;
        li.innerHTML = `
            <div class="project-color" style="background-color: ${project.color}"></div>
            ${project.name}
        `;
        projectsList.appendChild(li);
    });
}

// 渲染标签列表
function renderTags() {
    const tagsList = document.querySelector('.tags-list');
    tagsList.innerHTML = '';
    
    tags.forEach(tag => {
        const div = document.createElement('div');
        div.className = `tag-item ${currentTag === tag ? 'active' : ''}`;
        div.dataset.name = tag;
        div.textContent = tag;
        tagsList.appendChild(div);
    });
}

// 渲染记录列表
function renderRecords() {
    // 筛选记录
    let filteredRecords = records;
    
    if (currentView === 'today') {
        const today = new Date().toDateString();
        filteredRecords = filteredRecords.filter(record => 
            new Date(record.date).toDateString() === today
        );
    } else if (currentView === 'week') {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredRecords = filteredRecords.filter(record => 
            new Date(record.date) >= weekAgo
        );
    } else if (currentView === 'month') {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredRecords = filteredRecords.filter(record => 
            new Date(record.date) >= monthAgo
        );
    }
    
    if (currentProject) {
        filteredRecords = filteredRecords.filter(record => 
            record.projectId === currentProject
        );
    }
    
    if (currentTag) {
        filteredRecords = filteredRecords.filter(record => 
            record.tags.includes(currentTag)
        );
    }
    
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filteredRecords = filteredRecords.filter(record => 
            record.title.toLowerCase().includes(searchLower) ||
            record.content.toLowerCase().includes(searchLower)
        );
    }
    
    // 按日期排序
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 渲染记录
    recordsList.innerHTML = '';
    
    if (filteredRecords.length === 0) {
        recordsList.innerHTML = '<p class="no-records">暂无记录</p>';
    } else {
        filteredRecords.forEach(record => {
            const recordElement = createRecordElement(record);
            recordsList.appendChild(recordElement);
        });
    }
    
    // 更新记录数
    recordCount.textContent = `共 ${filteredRecords.length} 条记录`;
}

// 创建记录元素
function createRecordElement(record) {
    const div = document.createElement('div');
    div.className = `record-card ${record.important ? 'important' : ''}`;
    
    const project = projects.find(p => p.id === record.projectId) || projects[0];
    
    div.innerHTML = `
        <div class="record-meta">
            <div class="record-date">
                <i class="far fa-calendar"></i>
                ${formatDate(record.date)}
            </div>
            <div class="record-project" style="background-color: ${project.color}">
                ${project.name}
            </div>
        </div>
        <h3 class="record-title">${record.title}</h3>
        <p class="record-content">${record.content}</p>
        <div class="record-tags">
            ${record.tags.map(tag => `<span class="record-tag">${tag}</span>`).join('')}
        </div>
        <div class="record-actions">
            <button class="edit-btn" onclick="editRecord('${record.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteRecord('${record.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return div;
}

// 渲染GitHub表单
function renderGithubForm() {
    document.getElementById('github-token').value = githubConfig.accessToken;
    document.getElementById('github-repo').value = githubConfig.repo;
    document.getElementById('github-branch').value = githubConfig.branch;
    document.getElementById('github-path').value = githubConfig.path;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 打开记录模态框
function openRecordModal() {
    recordForm.reset();
    document.getElementById('record-id').value = '';
    document.getElementById('record-modal-title').textContent = '添加记录';
    document.getElementById('record-date').value = new Date().toISOString().slice(0, 16);
    document.getElementById('record-project').value = currentProject || 'default';
    document.getElementById('selected-tags').innerHTML = '';
    recordModal.classList.add('show');
}

// 编辑记录
function editRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;
    
    document.getElementById('record-id').value = record.id;
    document.getElementById('record-modal-title').textContent = '编辑记录';
    document.getElementById('record-title').value = record.title;
    document.getElementById('record-content').value = record.content;
    document.getElementById('record-date').value = new Date(record.date).toISOString().slice(0, 16);
    document.getElementById('record-project').value = record.projectId;
    document.getElementById('record-important').checked = record.important;
    
    // 渲染选中的标签
    const selectedTagsDiv = document.getElementById('selected-tags');
    selectedTagsDiv.innerHTML = '';
    record.tags.forEach(tag => {
        addSelectedTag(tag);
    });
    
    recordModal.classList.add('show');
}

// 删除记录
function deleteRecord(id) {
    if (confirm('确定要删除这条记录吗？')) {
        records = records.filter(r => r.id !== id);
        saveData();
        renderRecords();
    }
}

// 处理记录表单提交
function handleRecordSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('record-id').value;
    const title = document.getElementById('record-title').value;
    const content = document.getElementById('record-content').value;
    const date = document.getElementById('record-date').value;
    const projectId = document.getElementById('record-project').value;
    const important = document.getElementById('record-important').checked;
    
    // 获取选中的标签
    const selectedTags = Array.from(document.querySelectorAll('.selected-tag'))
        .map(tag => tag.dataset.name);
    
    if (!title.trim()) {
        alert('请输入记录标题');
        return;
    }
    
    if (id) {
        // 编辑记录
        const recordIndex = records.findIndex(r => r.id === id);
        if (recordIndex !== -1) {
            records[recordIndex] = {
                ...records[recordIndex],
                title,
                content,
                date,
                projectId,
                important,
                tags: selectedTags
            };
        }
    } else {
        // 添加记录
        records.push({
            id: Date.now().toString(),
            title,
            content,
            date,
            projectId,
            important,
            tags: selectedTags,
            createdAt: new Date().toISOString()
        });
    }
    
    // 保存数据
    saveData();
    
    // 关闭模态框
    closeAllModals();
    
    // 重新渲染
    renderRecords();
    renderTags();
}

// 打开项目模态框
function openProjectModal() {
    projectForm.reset();
    document.getElementById('project-modal-title').textContent = '添加项目';
    projectModal.classList.add('show');
}

// 处理项目表单提交
function handleProjectSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('project-name').value;
    const color = document.getElementById('project-color').value;
    
    if (!name.trim()) {
        alert('请输入项目名称');
        return;
    }
    
    // 检查项目是否已存在
    if (projects.some(p => p.name === name)) {
        alert('项目已存在');
        return;
    }
    
    // 添加项目
    projects.push({
        id: Date.now().toString(),
        name,
        color
    });
    
    // 保存数据
    saveData();
    
    // 关闭模态框
    closeAllModals();
    
    // 重新渲染
    renderProjects();
}

// 打开标签模态框
function openTagModal() {
    tagForm.reset();
    document.getElementById('tag-modal-title').textContent = '添加标签';
    tagModal.classList.add('show');
}

// 处理标签表单提交
function handleTagSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('tag-name').value.trim();
    
    if (!name) {
        alert('请输入标签名称');
        return;
    }
    
    // 检查标签是否已存在
    if (tags.includes(name)) {
        alert('标签已存在');
        return;
    }
    
    // 添加标签
    tags.push(name);
    
    // 保存数据
    saveData();
    
    // 关闭模态框
    closeAllModals();
    
    // 重新渲染
    renderTags();
}

// 打开GitHub模态框
function openGithubModal() {
    renderGithubForm();
    githubModal.classList.add('show');
}

// 处理GitHub表单提交
function handleGithubSubmit(e) {
    e.preventDefault();
    
    const accessToken = document.getElementById('github-token').value;
    const repo = document.getElementById('github-repo').value;
    const branch = document.getElementById('github-branch').value;
    const path = document.getElementById('github-path').value;
    
    if (!accessToken || !repo) {
        alert('请填写完整的GitHub信息');
        return;
    }
    
    // 保存配置
    githubConfig = {
        accessToken,
        repo,
        branch,
        path
    };
    
    // 保存到localStorage
    localStorage.setItem('worklog-github-config', JSON.stringify(githubConfig));
    
    // 关闭模态框
    closeAllModals();
    
    alert('GitHub配置已保存');
}

// 同步到GitHub
function syncWithGithub() {
    if (!githubConfig.accessToken || !githubConfig.repo) {
        alert('请先配置GitHub信息');
        return;
    }
    
    const syncBtn = document.getElementById('sync-btn');
    syncBtn.disabled = true;
    syncBtn.textContent = '同步中...';
    
    // 准备要同步的数据
    const syncData = {
        records,
        projects,
        tags,
        lastSync: new Date().toISOString()
    };
    
    // 将数据转换为Markdown格式
    const markdownContent = generateMarkdown(syncData);
    
    // 创建文件名
    const fileName = `${new Date().toISOString().slice(0, 10)}-worklog.md`;
    
    // 这里应该实现GitHub API调用
    // 由于实际环境限制，这里只是模拟同步
    setTimeout(() => {
        alert('同步成功！（模拟）');
        syncBtn.disabled = false;
        syncBtn.textContent = '同步到GitHub';
    }, 1500);
}

// 生成Markdown内容
function generateMarkdown(data) {
    let markdown = '# 工作记录\n\n';
    markdown += `*最后同步时间：${data.lastSync}*\n\n`;
    
    // 按项目分组记录
    const recordsByProject = {};
    data.records.forEach(record => {
        if (!recordsByProject[record.projectId]) {
            recordsByProject[record.projectId] = [];
        }
        recordsByProject[record.projectId].push(record);
    });
    
    // 生成项目部分
    Object.keys(recordsByProject).forEach(projectId => {
        const project = data.projects.find(p => p.id === projectId) || data.projects[0];
        markdown += `## ${project.name}\n\n`;
        
        // 按日期排序记录
        const projectRecords = recordsByProject[projectId].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        projectRecords.forEach(record => {
            markdown += `### ${record.title}\n`;
            markdown += `**日期：** ${formatDate(record.date)}\n`;
            if (record.important) {
                markdown += `**重要：** ✅\n`;
            }
            if (record.tags.length > 0) {
                markdown += `**标签：** ${record.tags.join(', ')}\n`;
            }
            markdown += `\n${record.content}\n\n`;
        });
    });
    
    return markdown;
}

// 处理视图切换
function handleViewChange(e) {
    // 移除所有活跃状态
    document.querySelectorAll('.view-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加活跃状态
    e.target.closest('.view-item').classList.add('active');
    
    // 更新当前视图
    currentView = e.target.closest('.view-item').dataset.view;
    
    // 重置其他筛选条件
    currentProject = null;
    currentTag = null;
    currentSearch = '';
    searchInput.value = '';
    
    // 重新渲染
    renderAll();
}

// 处理项目切换
function handleProjectChange(projectId) {
    currentProject = currentProject === projectId ? null : projectId;
    renderAll();
}

// 处理标签切换
function handleTagChange(tagName) {
    currentTag = currentTag === tagName ? null : tagName;
    renderAll();
}

// 处理搜索
function handleSearch(e) {
    currentSearch = e.target.value;
    renderRecords();
}

// 处理标签输入
function handleTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tagName = e.target.value.trim();
        
        if (tagName && !tags.includes(tagName)) {
            tags.push(tagName);
            saveData();
            renderTags();
            addSelectedTag(tagName);
        } else if (tagName && tags.includes(tagName)) {
            addSelectedTag(tagName);
        }
        
        e.target.value = '';
    }
}

// 添加选中的标签
function addSelectedTag(tagName) {
    const selectedTagsDiv = document.getElementById('selected-tags');
    
    // 检查标签是否已选中
    if (Array.from(selectedTagsDiv.querySelectorAll('.selected-tag'))
        .some(tag => tag.dataset.name === tagName)) {
        return;
    }
    
    const tagElement = document.createElement('span');
    tagElement.className = 'selected-tag';
    tagElement.dataset.name = tagName;
    tagElement.innerHTML = `${tagName} <i class="fas fa-times"></i>`;
    
    // 绑定删除事件
    tagElement.querySelector('i').addEventListener('click', () => {
        tagElement.remove();
    });
    
    selectedTagsDiv.appendChild(tagElement);
}

// 关闭所有模态框
function closeAllModals() {
    recordModal.classList.remove('show');
    projectModal.classList.remove('show');
    tagModal.classList.remove('show');
    githubModal.classList.remove('show');
    
    // 重置表单
    recordForm.reset();
    projectForm.reset();
    tagForm.reset();
    
    // 清空选中的标签
    document.getElementById('selected-tags').innerHTML = '';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 初始化MiniMax浮动球
function initMiniMaxBall() {
    const ball = document.getElementById('minimax-floating-ball');
    if (!ball) return;
    
    // 添加动画效果
    ball.addEventListener('mouseenter', () => {
        ball.style.transform = 'scale(1.1)';
    });
    
    ball.addEventListener('mouseleave', () => {
        ball.style.transform = 'scale(1)';
    });
    
    // 添加点击事件
    ball.addEventListener('click', () => {
        // 可以添加更多功能
        alert('感谢使用MiniMax Agent创建的工作记录网站！');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// CSS样式
const noRecordsStyle = document.createElement('style');
noRecordsStyle.textContent = `
    .no-records {
        text-align: center;
        color: #95a5a6;
        padding: 50px 0;
        font-size: 16px;
    }
`;
document.head.appendChild(noRecordsStyle);