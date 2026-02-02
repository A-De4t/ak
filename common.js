// 👉 全局函数1：基础登录校验（所有后台页通用，未登录直接跳登录）
function checkLoginAuth() {
    // 获取本地存储的登录用户
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");
    // 未登录 → 强制跳登录页
    if (!loginUser) {
        alert("请先登录系统！");
        window.location.href = PAGE_PATH.login;
        return false;
    }
    // 已登录 → 显示当前用户名
    const usernameEl = document.getElementById("current-username");
    usernameEl && (usernameEl.innerText = loginUser.username);
    return loginUser;
}

// 👉 全局函数2：管理员专属校验（仅admin.html调用，非管理员跳登录）
function checkAdminAuth() {
    const loginUser = checkLoginAuth();
    // 不是管理员 → 清空登录态+跳登录
    if (loginUser && loginUser.role !== "admin") {
        alert("您不是超级管理员，无权限访问此页面！");
        localStorage.removeItem("loginUser");
        window.location.href = PAGE_PATH.login;
        return false;
    }
    return true;
}

// 👉 全局函数3：退出登录（所有页面退出按钮调用，清空登录态+跳登录）
function logout() {
    if (confirm("确定要退出登录吗？")) {
        // 清空本地登录存储（核心）
        localStorage.removeItem("loginUser");
        alert("退出登录成功！");
        window.location.href = PAGE_PATH.login;
    }
}

// 👉 全局函数4：防止未登录直接访问后台（页面刷新/手动输地址都拦截）
document.addEventListener("DOMContentLoaded", () => {
    // 排除登录页，其他页面都做基础校验
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== PAGE_PATH.login) {
        checkLoginAuth();
    }
});
