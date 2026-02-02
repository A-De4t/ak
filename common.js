// 后端接口地址
const API_BASE = "http://127.0.0.1:5000/api";

// 校验登录状态
async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_BASE}/check`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("校验登录态失败:", error);
        return {is_login: false};
    }
}

// 退出登录
async function logout() {
    if (confirm("确定要退出吗？")) {
        try {
            await fetch(`${API_BASE}/logout`, {
                credentials: 'include'
            });
            alert("退出成功");
            window.location.href = "login.html";
        } catch (error) {
            alert("退出失败，请稍后重试");
        }
    }
}

// 页面加载时自动校验登录态
async function protectPage() {
    const status = await checkLoginStatus();
    if (!status.is_login) {
        alert("请先登录！");
        window.location.href = "login.html";
    } else {
        // 如果页面有显示用户名的元素，就更新它
        const userEl = document.getElementById("current-user");
        if (userEl) userEl.textContent = status.username;
    }
}
