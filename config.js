// 🔥 系统核心配置：所有账号密码（仅改此文件即可管理账号，无需动其他代码）
// 格式：{username: "账号", password: "密码", role: "admin/proxy"}
// role=admin → 超级管理员（仅你）；role=proxy → 普通代理
const USER_LIST = [
    // 你的超级管理员账号（唯一，勿改role）
    { username: "ak", password: "2026", role: "admin" },
    // 普通代理账号（可自由新增/删除/修改，复制一行改账号密码即可）
    { username: "proxy001", password: "proxy001@2026", role: "proxy" },
    { username: "proxy002", password: "proxy002@2026", role: "proxy" }
    // 新增代理示例：
    // { username: "proxy003", password: "123456", role: "proxy" },
];

// 🔥 页面路径配置（纯GitHub Pages相对路径，无需修改）
const PAGE_PATH = {
    login: "login.html", // 登录页
    admin: "admin.html", // 管理员页
    proxy: "proxy.html"  // 代理页
};
