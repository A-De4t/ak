from flask import Flask, request, jsonify, session, abort
from flask_cors import CORS
import time
from datetime import timedelta

app = Flask(__name__)
# 1. 升级秘钥，提高安全性
app.secret_key = "AK_SuperAdmin_2026_Proxy_Manager_Secret"
# 2. 设置登录态1小时有效期，无操作自动退出
app.permanent_session_lifetime = timedelta(hours=1)
# 3. 核心：允许GitHub Pages和本地跨域（关键适配公网访问）
CORS(app, supports_credentials=True, origins=[
    "https://a-de4t.github.io",  # GitHub Pages公网地址
    "http://127.0.0.1:5500",     # 本地Live Server地址
    "http://localhost:5500"      # 本地备用地址
])

# 🔥 账号配置：超级管理员（你）+ 普通代理账号
USER_LIST = {
    # 你的超级管理员账号
    "ak": {"password": "2026", "role": "admin"},
    # 普通代理账号（示例）
    "proxy001": {"password": "proxy001@2026", "role": "proxy"},
    "proxy002": {"password": "proxy002@2026", "role": "proxy"}
}

# 🔥 防暴力破解配置
login_attempts = {}
MAX_ERROR_TIMES = 5
LOCK_TIME = 900

# 👉 登录接口
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({"success": False, "message": "账号和密码不能为空！"})
    if username not in USER_LIST:
        return jsonify({"success": False, "message": "账号不存在！"})
    
    # 检查锁定状态
    if username in login_attempts:
        error_info = login_attempts[username]
        if error_info['times'] >= MAX_ERROR_TIMES and (time.time() - error_info['last_time']) < LOCK_TIME:
            remain_min = int((LOCK_TIME - (time.time() - error_info['last_time'])) // 60)
            return jsonify({"success": False, "message": f"连续5次密码错误，账号锁定15分钟！剩余{remain_min}分钟"})
        elif error_info['times'] >= MAX_ERROR_TIMES:
            del login_attempts[username]
    
    # 校验密码
    if USER_LIST[username]['password'] == password:
        if username in login_attempts:
            del login_attempts[username]
        session['username'] = username
        session['role'] = USER_LIST[username]['role']
        return jsonify({
            "success": True,
            "message": f"{USER_LIST[username]['role']=='admin'?'超级管理员':'代理'}登录成功！"，
            "username": username,
            "role": USER_LIST[username]['role']
        })
    else:
        if username not in login_attempts:
            login_attempts[username] = {"times": 1, "last_time": time.time()}
        else:
            login_attempts[username]['times'] += 1
            login_attempts[username]['last_time'] = time.time()
        remain_times = MAX_ERROR_TIMES - login_attempts[username]['times']
        return jsonify({"success": False, "message": f"密码错误！剩余{remain_times}次尝试机会"})

# 👉 权限校验接口
@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if 'username' in session and 'role' in session and session['username'] in USER_LIST:
        return jsonify({
            "is_login": True,
            "username": session['username'],
            "role": session['role']
        })
    return jsonify({"is_login": False, "message": "未登录或登录态已失效"})

# 👉 退出登录接口
@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    session.pop('role', None)
    return jsonify({"success": True, "message": "退出登录成功！"})

# 👉 获取代理列表接口
@app.route('/api/get-proxies', methods=['GET'])
def get_proxies():
    if 'username' in session and session['role'] == 'admin':
        proxies = {k: v for k, v in USER_LIST.items() if v['role'] == 'proxy'}
        return jsonify({"success": True, "proxies": proxies})
    return jsonify({"success": False, "message": "无权限访问！"})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
