// 模拟数据
const mockUsers = [
    { id: 1, username: 'admin', role: '超级管理员', createTime: '2023-01-01', status: '活跃' },
    { id: 2, username: 'proxy001', role: '代理', createTime: '2023-02-15', status: '活跃' },
    { id: 3, username: 'proxy002', role: '代理', createTime: '2023-03-20', status: '禁用' }
];

const mockLogs = [
    { id: 1, operator: 'admin', action: '添加用户', target: 'proxy003', time: '2023-04-01 14:30:00' },
    { id: 2, operator: 'admin', action: '修改权限', target: 'proxy002', time: '2023-04-02 09:15:00' },
    { id: 3, operator: 'proxy001', action: '查看数据', target: '代理数据', time: '2023-04-03 16:45:00' }
];

const mockStats = {
    totalUsers: 3,
    activeUsers: 2,
    totalLogs: 3,
    todayLogs: 1
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 默认加载第一个页面
    loadPage('proxyAccount');

    // 为所有菜单项绑定点击事件
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有菜单项的激活状态
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            // 给当前点击的菜单项添加激活状态
            this.classList.add('active');
            // 获取并加载目标页面
            const targetPage = this.getAttribute('data-target');
            loadPage(targetPage);
        });
    });

    // 退出登录按钮事件
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            alert('已退出登录');
            // 这里可以跳转到登录页
        }
    });
});

// 根据菜单项加载对应的页面内容
function loadPage(pageName) {
    const contentArea = document.getElementById('contentArea');
    let pageHTML = '';

    switch(pageName) {
        case 'proxyAccount':
            pageHTML = `
                <div class="page-title">添加新用户</div>
                <div class="card">
                    <form id="addUserForm">
                        <div class="form-group">
                            <label for="username">用户名：</label>
                            <input type="text" id="username" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="password">密码：</label>
                            <input type="password" id="password" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="role">权限：</label>
                            <select id="role" class="form-control">
                                <option value="admin">管理员</option>
                                <option value="proxy">代理</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">保存</button>
                    </form>
                </div>
            `;
            break;
        case 'systemConfig':
            pageHTML = `
                <div class="page-title">已添加的账户信息</div>
                <div class="card">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>用户名</th>
                                <th>权限</th>
                                <th>创建时间</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockUsers.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.role}</td>
                                    <td>${user.createTime}</td>
                                    <td>${user.status === '活跃' ? '<span style="color: #67c23a;">活跃</span>' : '<span style="color: #f56c6c;">禁用</span>'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;
        case 'dataView':
            pageHTML = `
                <div class="page-title">代理数据统计</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${mockStats.totalUsers}</div>
                        <div class="stat-label">总用户数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${mockStats.activeUsers}</div>
                        <div class="stat-label">活跃用户</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${mockStats.totalLogs}</div>
                        <div class="stat-label">总日志数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${mockStats.todayLogs}</div>
                        <div class="stat-label">今日新增日志</div>
                    </div>
                </div>
                <div class="card">
                    <p>这里可以添加更详细的图表和报表，例如用户增长趋势、代理数据分布等。</p>
                </div>
            `;
            break;
        case 'operationLog':
            pageHTML = `
                <div class="page-title">操作日志</div>
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>共 ${mockLogs.length} 条日志记录</span>
                    <button id="exportLogs" class="btn btn-primary">导出日志</button>
                </div>
                <div class="card">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>操作人</th>
                                <th>操作</th>
                                <th>目标</th>
                                <th>时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mockLogs.map(log => `
                                <tr>
                                    <td>${log.id}</td>
                                    <td>${log.operator}</td>
                                    <td>${log.action}</td>
                                    <td>${log.target}</td>
                                    <td>${log.time}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;
        case 'permission':
            pageHTML = `
                <div class="page-title">系统权限分配</div>
                <div class="card">
                    <div class="form-group">
                        <label>选择用户：</label>
                        <select class="form-control">
                            ${mockUsers.map(user => `<option value="${user.id}">${user.username} (${user.role})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>分配权限：</label>
                        <ul class="permission-list">
                            <li><input type="checkbox" id="perm1"> <label for="perm1">代理账号管理</label></li>
                            <li><input type="checkbox" id="perm2"> <label for="perm2">系统全局配置管理</label></li>
                            <li><input type="checkbox" id="perm3"> <label for="perm3">所有代理数据查看/统计</label></li>
                            <li><input type="checkbox" id="perm4"> <label for="perm4">操作日志查看与导出</label></li>
                            <li><input type="checkbox" id="perm5"> <label for="perm5">系统权限分配</label></li>
                        </ul>
                    </div>
                    <button class="btn btn-primary">保存权限</button>
                </div>
            `;
            break;
        default:
            pageHTML = '<p>页面不存在</p>';
    }

    // 将生成的 HTML 插入到内容区域
    contentArea.innerHTML = pageHTML;

    // 为新加载的页面绑定事件
    bindPageEvents(pageName);
}

// 为特定页面绑定事件
function bindPageEvents(pageName) {
    switch(pageName) {
        case 'proxyAccount':
            // 绑定添加用户表单的提交事件
            document.getElementById('addUserForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const role = document.getElementById('role').value;
                alert(`用户 ${username} 已成功添加，权限为 ${role === 'admin' ? '管理员' : '代理'}`);
                this.reset();
            });
            break;
        case 'operationLog':
            // 绑定导出日志按钮事件
            document.getElementById('exportLogs').addEventListener('click', function() {
                alert('日志导出成功！');
            });
            break;
        default:
            break;
    }
}
