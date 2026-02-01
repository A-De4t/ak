// 全局常量（所有页面共用，改一次全生效）
const CONFIG = {
  LOGIN_PAGE: 'index.html',    // 登录页路径
  ADMIN_PAGE: 'admin.html',    // 管理员后台路径
  PROXY_PAGE: 'proxy.html',    // 代理页路径
  SUPER_ADMIN: { username: 'ak', password: '2026', role: 'admin' } // 超级管理员账号
};

// 1. 获取本地存储的用户/文件数据（所有页面共用）
function getLocalData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
// 2. 保存数据到本地存储（所有页面共用）
function setLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// 3. 格式化文件大小（后台/代理页文件管理用）
function formatFileSize(size) {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
}
// 4. 通用退出登录（所有页面的退出按钮都用这个）
function logout() {
  if (confirm('确定退出吗？')) {
    localStorage.removeItem('currentLoginUser');
    window.location.href = CONFIG.LOGIN_PAGE;
  }
}
// 5. 权限验证通用方法（后台/代理页初始化用）
function checkAuth(requiredRole) {
  const currentUser = getLocalData('currentLoginUser')[0] || null;
  if (!currentUser || currentUser.role !== requiredRole) {
    alert('无对应权限，禁止访问！');
    window.location.href = CONFIG.LOGIN_PAGE;
    return false;
  }
  return currentUser;
}
