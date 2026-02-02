// 🔥 核心：后端公网可访问地址（必须修改为「你的公网IP:5000」，本地也兼容）
// 示例：const API_BASE = "http://123.45.67.89:5000/api";
const API_BASE = "223.115.16.232"; 

// 👉 全局函数1：校验登录态和权限（所有后台页window.onload调用）
async function checkAuth() {
    try {
        const res = await fetch(`${API_BASE}/check-auth`, {
            method: "GET",
            credentials: "include", // 携带登录态cookie，关键！
            headers: {"Content-Type": "application/json"}
        });
        const data = await res.json();
        // 未登录 → 跳回登录页（GitHub/本地都适配）
        if (!data.is_login) {
            alert(data.message || "请先登录！");
            window.location.href = "https://a-de4t.github.io/ak/login.html"; // GitHub登录页地址
            // 本地测试时可替换为：window.location.href = "login.html";
            return false;
        }
        // 已登录 → 显示当前用户名（页面需有id="current-username"的元素）
        const usernameEl = document.getElementById("current-username");
        if (usernameEl) usernameEl.innerText = data.username;
        // 返回登录信息，供页面后续判断权限
        return data;
    } catch (err) {
        console.error("权限校验失败：", err);
        alert("后端服务未启动或网络错误！请检查后端是否运行");
        window.location.href = "https://a-de4t.github.io/ak/login.html";
        return false;
    }
}

// 👉 全局函数2：退出登录（所有后台页退出按钮调用）
async function logout() {
    if (confirm("确定要退出登录吗？")) {
        try {
            await fetch(`${API_BASE}/logout`, {
                method: "GET",
                credentials: "include"
            });
            alert("退出成功！");
            window.location.href = "https://a-de4t.github.io/ak/login.html";
        } catch (err) {
            alert("退出失败，请稍后重试！");
            console.error("退出失败：", err);
        }
    }
}

// 👉 全局函数3：无操作自动退出（基于sessionStorage，配合后端1小时有效期）
function initAutoLogout() {
    // 记录当前登录时间
    if (!sessionStorage.getItem("loginTime")) {
        sessionStorage.setItem("loginTime", new Date().getTime());
    }
    // 定时校验（每3分钟检查一次）
    setInterval(() => {
        const loginTime = Number(sessionStorage.getItem("loginTime"));
        const now = new Date().getTime();
        const oneHour = 3600000; // 1小时（毫秒）
        // 1小时无操作 → 自动退出
        if (now - loginTime > oneHour) {
            sessionStorage.removeItem("loginTime");
            logout();
        }
    }, 180000); // 3分钟=180000毫秒

    // 页面有操作（点击/输入）→ 更新登录时间
    document.addEventListener("click", () => sessionStorage.setItem("loginTime", new Date().getTime()));
    document.addEventListener("input", () => sessionStorage.setItem("loginTime", new Date().getTime()));
}

// 👉 全局函数4：管理员权限校验（仅admin.html调用，拦截代理访问）
async function checkAdminAuth() {
    const authInfo = await checkAuth();
    // 不是超级管理员 → 跳转到代理页
    if (authInfo && authInfo.role !== "admin") {
        alert("您不是超级管理员，无权限访问管理后台！");
        window.location.href = "https://a-de4t.github.io/ak/proxy.html";
        return false;
    }
    return true;
}
