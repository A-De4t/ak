// 模拟系统用户数据库（实际项目中替换为后端接口）
const systemUsers = [
    // 超级管理员账号
    { username: 'admin', password: '123456', role: 'superAdmin' },
    // 代理账号
    { username: 'proxy001', password: 'proxy123', role: 'proxy' },
    { username: 'proxy002', password: 'proxy456', role: 'proxy' }
];

// 模拟数据（保持原有）
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

// 代理专属数据（新增）
const proxyMockData = {
    myStats: {
        totalOrders: 120,
        todayOrders: 8,
        totalIncome: 35600,
        todayIncome: 2400
    },
    myLogs: [
        { id: 1, action: '查看数据报表', time: '2023-04-03 10:20:00' },
        { id: 2, action: '导出数据', time: '2023-04-02 15:30:00' },
        { id: 3, action: '修改个人密码', time: '2023-04-01 09:10:00' }
    ]
};

// 登录表单提交事件（登录页专用）
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) { // 只有登录页才绑定该事件
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const role = document.getElementById('userRole').value;

            // 验证输入
            if (!username || !password || !role) {
                alert('请填写完整信息！');
                return;
            }

            // 验证账号密码（实际项目中替换为后端接口请求）
            const user = systemUsers.find(u => 
                u.username === username && 
                u.password === password && 
                u.role === role
            );

            if (user) {
                // 登录成功：存储用户信息到本地存储（实际项目中用 token）
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                // 根据角色跳转到对应后台
                if (role === 'superAdmin') {
                    window.location.href = 'admin.html';
                } else if (role === 'proxy') {
                    window.location.href = 'proxy.html';
                }
            } else {
                alert('用户名、密码或角色不匹配！');
            }
        });
    }

    // 超级管理员退出登录
    const adminLogoutBtn = document.getElementById('logoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            }
        });
    }

    // 代理退出登录
    const proxyLogoutBtn = document.getElementById('proxyLogoutBtn');
    if (proxyLogoutBtn) {
        proxyLogoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            }
        });
    }
});

// 初始化超级管理员后台（admin.html 专用）
function initAdminDashboard() {
    // 默认加载第一个页面
    loadAdminPage('proxyAccount');

    // 为所有菜单项绑定点击事件
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const targetPage = this.getAttribute('data-target');
            loadAdminPage(targetPage);
        });
    });
}

// 加载超级管理员页面内容
function loadAdminPage(pageName) {
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
                                <<th>ID</</th>
                                <<th>用户名</</th>
                                <<th>权限</</th>
                                <<th>创建时间</</th>
                                <<th>状态</</th>
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
                                <<th>ID</</th>
                                <<th>操作人</</th>
                                <<th>操作</</th>
                                <<th>目标</</th>
                                <<th>时间</</th>
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

    contentArea.innerHTML = pageHTML;
    // 绑定页面事件
    bindAdminPageEvents(pageName);
}

// 绑定超级管理员页面事件
function bindAdminPageEvents(pageName) {
    switch(pageName) {
        case 'proxyAccount':
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
            document.getElementById('exportLogs').addEventListener('click', function() {
                alert('日志导出成功！');
            });
            break;
        default:
            break;
    }
}

// 初始化代理后台（proxy.html 专用）
function initProxyDashboard() {
    // 默认加载第一个页面
    loadProxyPage('proxyData');

    // 为所有菜单项绑定点击事件
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const targetPage = this.getAttribute('data-target');
            loadProxyPage(targetPage);
        });
    });
}

// 加载代理页面内容
function loadProxyPage(pageName) {
    const contentArea = document.getElementById('proxyContentArea');
    let pageHTML = '';

    switch(pageName) {
        case 'proxyData':
            pageHTML = `
                <div class="page-title">我的代理数据</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${proxyMockData.myStats.totalOrders}</div>
                        <div class="stat-label">总订单数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${proxyMockData.myStats.todayOrders}</div>
                        <div class="stat-label">今日订单数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${proxyMockData.myStats.totalIncome}</div>
                        <div class="stat-label">总收益（元）</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${proxyMockData.myStats.todayIncome}</div>
                        <div class="stat-label">今日收益（元）</div>
                    </div>
                </div>
                <div class="card">
                    <h4>最近订单列表</h4>
                    <table class="table" style="margin-top: 1rem;">
                        <thead>
                            <tr>
                                <<th>订单ID</</th>
                                <<th>客户名称</</th>
                                <<th>订单金额</</th>
                                <<th>下单时间</</th>
                                <<th>状态</</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>OD20230403001</td>
                                <td>客户A</td>
                                <td>800元</td>
                                <td>2023-04-03 10:20:00</td>
                                <td><span style="color: #67c23a;">已完成</span></td>
                            </tr>
                            <tr>
                                <td>OD20230403002</td>
                                <td>客户B</td>
                                <td>1200元</td>
                                <td>2023-04-03 14:30:00</td>
                                <td><span style="color: #409eff;">处理中</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="btn btn-primary" style="margin-top: 1rem;">导出完整数据</button>
                </div>
            `;
            break;
        case 'proxyProfile':
            pageHTML = `
                <div class="page-title">个人信息管理</div>
                <div class="card">
                    <form id="proxyProfileForm">
                        <div class="form-group">
                            <label>用户名：</label>
                            <input type="text" class="form-control" value="${JSON.parse(localStorage.getItem('loggedInUser')).username}" disabled>
                        </div>
                        <div class="form-group">
                            <label>当前密码：</label>
                            <input type="password" class="form-control" required placeholder="请输入当前密码">
                        </div>
                        <div class="form-group">
                            <label>新密码：</label>
                            <input type="password" class="form-control" required placeholder="请输入新密码">
                        </div>
                        <div class="form-group">
                            <label>确认新密码：</label>
                            <input type="password" class="form-control" required placeholder="请再次输入新密码">
                        </div>
                        <button type="submit" class="btn btn-primary">保存修改</button>
                    </form>
                </div>
            `;
            break;
        case 'proxyLogs':
            pageHTML = `
                <div class="page-title">我的操作日志</div>
                <div class="card">
                    <table class="table">
                        <thead>
                            <tr>
                                <<th>ID</</th>
                                <<th>操作</</th>
                                <<th>操作时间</</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${proxyMockData.myLogs.map(log => `
                                <tr>
                                    <td>${log.id}</td>
                                    <td>${log.action}</td>
                                    <td>${log.time}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;
        default:
            pageHTML = '<p>页面不存在</p>';
    }

    contentArea.innerHTML = pageHTML;
    // 绑定代理页面事件
    bindProxyPageEvents(pageName);
}

// 绑定代理页面事件
function bindProxyPageEvents(pageName) {
    switch(pageName) {
        case 'proxyProfile':
            document.getElementById('proxyProfileForm').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('密码修改成功！请重新登录');
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            });
            break;
        default:
            break;
    }
}
