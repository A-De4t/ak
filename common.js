// 全局页面路径配置（登录页直接指向index.html）
const PAGE_PATH = {
    login: "index.html",
    admin: "admin.html",
    proxy: "proxy.html"
};

// 👉 1. 基础登录校验（所有后台页通用，未登录强制跳index.html）
function checkLoginAuth() {
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");
    if (!loginUser) {
        alert("请先登录系统！");
        window.location.href = PAGE_PATH.login;
        return false;
    }
    // 已登录则显示用户名
    const usernameEl = document.getElementById("current-username");
    usernameEl && (usernameEl.innerText = loginUser.username);
    return loginUser;
}

// 👉 2. 管理员专属校验（仅admin.html调用，非管理员清登录态跳index.html）
function checkAdminAuth() {
    const loginUser = checkLoginAuth();
    if (loginUser && loginUser.role !== "admin") {
        alert("您不是超级管理员，无权限访问此页面！");
        localStorage.removeItem("loginUser");
        window.location.href = PAGE_PATH.login;
        return false;
    }
    return true;
}

// 👉 3. 退出登录（清空登录态，跳回index.html登录页）
function logout() {
    if (confirm("确定要退出登录吗？")) {
        localStorage.removeItem("loginUser");
        alert("退出登录成功！");
        window.location.href = PAGE_PATH.login;
    }
}

// 👉 4. 自动拦截未登录访问（刷新/手动输地址都触发，仅排除index.html）
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== PAGE_PATH.login) {
        checkLoginAuth();
    }
});
