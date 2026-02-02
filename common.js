// 后端接口基础地址，和后端保持一致
const API_BASE = "http://127.0.0.1:5000/api";

// 🔥 校验登录状态+超级管理员权限（核心：仅ak通过）
async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_BASE}/check`, {
            credentials: 'include' // 必须带，保存登录态cookie
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("权限校验失败:", error);
        return {is_login: false, role: ""};
    }
}

// 退出登录：清空session，返回登录页
async function logout() {
    if (confirm("确定要退出超级管理员账号吗？")) {
        try {
            await fetch(`${API_BASE}/logout`, {
                credentials: 'include'
            });
            alert("退出成功，已销毁登录态！");
            window.location.href = "login.html";
        } catch (error) {
            alert("退出失败，请稍后重试！");
        }
    }
}

// 🔥 页面终极保护：所有后台页加载即校验，非ak直接踢回登录页
async function protectPage() {
    const status = await checkLoginStatus();
    const currentPage = window.location.pathname.split('/').pop();

    // 1. 权限校验：非ak直接踢回登录页
    if (!status.is_login || status.role !== 'super_admin') {
        alert("您不是系统超级管理员，无访问权限！");
        window.location.href = "login.html";
        return;
    }

    // 2. 无操作超时校验：1小时（3600000毫秒）
    const loginTime = sessionStorage.getItem('login_time');
    const now = new Date().getTime();
    if (now - loginTime > 3600000) {
        alert("1小时无操作，已自动退出登录！");
        // 清空登录态并返回
        sessionStorage.removeItem('login_time');
        await fetch(`${API_BASE}/logout`, {credentials: 'include'});
        window.location.href = "login.html";
        return;
    }

    // 3. 正常显示用户名，更新操作时间
    const userEl = document.getElementById("current-user");
    if (userEl) userEl.textContent = status.username;
    sessionStorage.setItem('login_time', now); // 每次操作更新时间
}
