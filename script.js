// ========== 核心：初始化系统用户数据（持久化存储） ==========
function initSystemUsers() {
    // 检查localStorage是否有用户数据，没有则初始化默认超级管理员
    if (!localStorage.getItem('systemUsers')) {
        const defaultUsers = [
            // 超级管理员（默认账号，不可删除/禁用）
            { id: 1, username: 'admin', password: '123456', role: 'superAdmin', status: 'active', createTime: '2023-01-01' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
    }
}

// 初始化用户数据
initSystemUsers();

// ========== 工具函数：获取/更新用户数据 ==========
// 获取所有系统用户
function getSystemUsers() {
    return JSON.parse(localStorage.getItem('systemUsers') || '[]');
}

// 保存用户数据到localStorage
function saveSystemUsers(users) {
    localStorage.setItem('systemUsers', JSON.stringify(users));
}

// 生成唯一ID
function generateId() {
    return Date.now(); // 用时间戳作为唯一ID
}

// ========== 登录逻辑（修复 GitHub Pages 跳转问题） ==========
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) { // 只有登录页才绑定该事件
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            // 验证输入
            if (!username || !password) {
                alert('请填写完整信息！');
                return;
            }

            // 获取所有系统用户
            const systemUsers = getSystemUsers();
            
            // 验证账号密码（自动匹配角色）
            const user = systemUsers.find(u => 
                u.username === username && 
                u.password === password
            );

            if (user) {
                // 检查账号状态
                if (user.status !== 'active') {
                    alert('该账号已被禁用，请联系管理员！');
                    return;
                }

                // 登录成功：存储用户信息到本地存储
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                
                // 修复：适配 GitHub Pages 路径跳转
                const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
                // 自动判断角色并跳转
                if (user.role === 'superAdmin') {
                    window.location.href = baseUrl + 'admin.html';
                } else if (user.role === 'proxy') {
                    window.location.href = baseUrl + 'proxy.html';
                }
            } else {
                alert('用户名或密码错误！');
            }
        });
    }

    // 超级管理员退出登录（修复跳转路径）
    const adminLogoutBtn = document.getElementById('logoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('loggedInUser');
                const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '');
                window.location.href = baseUrl + 'index.html';
            }
        });
    }

    // 代理退出登录（修复跳转路径）
    const proxyLogoutBtn = document.getElementById('proxyLogoutBtn');
    if (proxyLogoutBtn) {
        proxyLogoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('loggedInUser');
                const baseUrl = window.location.origin + window.location.pathname.replace('proxy.html', '');
                window.location.href = baseUrl + 'index.html';
            }
        });
    }
});

// ========== 超级管理员后台逻辑 ==========
// 初始化超级管理员后台
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
    const systemUsers = getSystemUsers(); // 获取最新用户数据

    switch(pageName) {
        case 'proxyAccount':
            // 代理账号管理：新增账号表单
            pageHTML = `
                <div class="page-title">添加新用户</div>
                <div class="card">
                    <form id="addUserForm">
                        <div class="form-group">
                            <label for="username">用户名：</label>
                            <input type="text" id="username" class="form-control" required placeholder="请输入用户名">
                        </div>
                        <div class="form-group">
                            <label for="password">密码：</label>
                            <input type="password" id="password" class="form-control" required placeholder="请输入密码">
                        </div>
                        <div class="form-group">
                            <label for="role">权限：</label>
                            <select id="role" class="form-control">
                                <option value="proxy">代理</option>
                                <option value="superAdmin">超级管理员</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">保存</button>
                    </form>
                </div>
            `;
            break;
        
        case 'systemConfig':
            // 系统全局配置：显示所有账号 + 操作按钮
            pageHTML = `
                <div class="page-title">已添加的账户信息</div>
                <div class="card">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>用户名</th>
                                <th>密码</th>
                                <th>权限</th>
                                <th>创建时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${systemUsers.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.username}</td>
                                    <td>${user.password}</td>
                                    <td>${user.role === 'superAdmin' ? '超级管理员' : '代理'}</td>
                                    <td>${user.createTime}</td>
                                    <td>${user.status === 'active' ? 
                                        '<span style="color: #67c23a;">活跃</span>' : 
                                        '<span style="color: #f56c6c;">禁用</span>'}</td>
                                    <td>
                                        ${user.role === 'superAdmin' ? 
                                            '<span style="color: #999;">不可操作</span>' : 
                                            `
                                                ${user.status === 'active' ? 
                                                    `<button class="btn-operation btn-disable" onclick="toggleUserStatus(${user.id}, 'disable')">禁用</button>` : 
                                                    `<button class="btn-operation btn-enable" onclick="toggleUserStatus(${user.id}, 'enable')">启用</button>`
                                                }
                                                <button class="btn-operation btn-delete" onclick="deleteUser(${user.id})">删除</button>
                                            `
                                        }
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            break;

        case 'dataView':
            // 数据统计（按角色统计）
            const totalUsers = systemUsers.length;
            const activeUsers = systemUsers.filter(u => u.status === 'active').length;
            const proxyUsers = systemUsers.filter(u => u.role === 'proxy').length;
            
            pageHTML = `
                <div class="page-title">代理数据统计</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${totalUsers}</div>
                        <div class="stat-label">总用户数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${activeUsers}</div>
                        <div class="stat-label">活跃用户</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${proxyUsers}</div>
                        <div class="stat-label">代理用户数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${totalUsers - activeUsers}</div>
                        <div class="stat-label">禁用用户</div>
                    </div>
                </div>
                <div class="card">
                    <p>这里可以添加更详细的图表和报表，例如用户增长趋势、代理数据分布等。</p>
                </div>
            `;
            break;

        case 'operationLog':
            // 操作日志（模拟）
            const mockLogs = [
                { id: 1, operator: 'admin', action: '添加用户', target: 'proxy003', time: '2023-04-01 14:30:00' },
                { id: 2, operator: 'admin', action: '修改权限', target: 'proxy002', time: '2023-04-02 09:15:00' },
                { id: 3, operator: 'proxy001', action: '查看数据', target: '代理数据', time: '2023-04-03 16:45:00' }
            ];

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
            // 权限分配（简化版）
            pageHTML = `
                <div class="page-title">系统权限分配</div>
                <div class="card">
                    <div class="form-group">
                        <label>选择用户：</label>
                        <select class="form-control" id="permissionUser">
                            ${systemUsers.filter(u => u.role !== 'superAdmin').map(user => 
                                `<option value="${user.id}">${user.username} (${user.role === 'proxy' ? '代理' : '管理员'})</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>分配权限：</label>
                        <ul class="permission-list">
                            <li><input type="checkbox" id="perm1"> <label for="perm1">查看代理数据</label></li>
                            <li><input type="checkbox" id="perm2"> <label for="perm2">导出代理数据</label></li>
                            <li><input type="checkbox" id="perm3"> <label for="perm3">修改个人信息</label></li>
                            <li><input type="checkbox" id="perm4"> <label for="perm4">查看操作日志</label></li>
                        </ul>
                    </div>
                    <button class="btn btn-primary" onclick="savePermission()">保存权限</button>
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

// ========== 管理员页面事件绑定 ==========
function bindAdminPageEvents(pageName) {
    switch(pageName) {
        case 'proxyAccount':
            // 新增用户表单提交
            const addForm = document.getElementById('addUserForm');
            if (addForm) {
                addForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const username = document.getElementById('username').value.trim();
                    const password = document.getElementById('password').value.trim();
                    const role = document.getElementById('role').value;

                    // 验证用户名是否已存在
                    const systemUsers = getSystemUsers();
                    const userExists = systemUsers.some(u => u.username === username);
                    if (userExists) {
                        alert('用户名已存在，请更换！');
                        return;
                    }

                    // 创建新用户
                    const newUser = {
                        id: generateId(),
                        username: username,
                        password: password,
                        role: role,
                        status: 'active',
                        createTime: new Date().toLocaleDateString() // 当前日期
                    };

                    // 添加到用户列表并保存
                    systemUsers.push(newUser);
                    saveSystemUsers(systemUsers);

                    alert(`用户 ${username} 已成功添加！角色：${role === 'proxy' ? '代理' : '超级管理员'}`);
                    this.reset(); // 清空表单
                });
            }
            break;

        case 'operationLog':
            // 导出日志
            const exportBtn = document.getElementById('exportLogs');
            if (exportBtn) {
                exportBtn.addEventListener('click', function() {
                    alert('日志导出成功！');
                });
            }
            break;

        case 'permission':
            // 保存权限（模拟）
            window.savePermission = function() {
                alert('权限保存成功！');
            };
            break;

        default:
            break;
    }
}

// ========== 用户操作核心函数（全局可用） ==========
// 删除用户
window.deleteUser = function(userId) {
    if (confirm('确定要删除该用户吗？删除后不可恢复！')) {
        let systemUsers = getSystemUsers();
        // 过滤掉要删除的用户
        systemUsers = systemUsers.filter(u => u.id !== userId);
        saveSystemUsers(systemUsers);
        // 刷新页面
        loadAdminPage('systemConfig');
        alert('用户删除成功！');
    }
};

// 启用/禁用用户
window.toggleUserStatus = function(userId, action) {
    let systemUsers = getSystemUsers();
    const userIndex = systemUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        systemUsers[userIndex].status = action === 'enable' ? 'active' : 'disabled';
        saveSystemUsers(systemUsers);
        // 刷新页面
        loadAdminPage('systemConfig');
        alert(`用户已${action === 'enable' ? '启用' : '禁用'}！`);
    }
};

// ========== 代理后台逻辑 ==========
// 初始化代理后台
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

    // 代理专属模拟数据
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
                                <th>订单ID</th>
                                <th>客户名称</th>
                                <th>订单金额</th>
                                <th>下单时间</th>
                                <th>状态</th>
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
            // 个人信息管理
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            pageHTML = `
                <div class="page-title">个人信息管理</div>
                <div class="card">
                    <form id="proxyProfileForm">
                        <div class="form-group">
                            <label>用户名：</label>
                            <input type="text" class="form-control" value="${loggedInUser.username}" disabled>
                        </div>
                        <div class="form-group">
                            <label>当前密码：</label>
                            <input type="password" id="currentPwd" class="form-control" required placeholder="请输入当前密码">
                        </div>
                        <div class="form-group">
                            <label>新密码：</label>
                            <input type="password" id="newPwd" class="form-control" required placeholder="请输入新密码">
                        </div>
                        <div class="form-group">
                            <label>确认新密码：</label>
                            <input type="password" id="confirmPwd" class="form-control" required placeholder="请再次输入新密码">
                        </div>
                        <button type="submit" class="btn btn-primary">保存修改</button>
                    </form>
                </div>
            `;
            break;

        case 'proxyLogs':
            pageHTML = `
                <div class="page-title
