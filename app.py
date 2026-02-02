from flask import Flask, request, jsonify, session
from flask_cors import CORS
import time  # 新增：用于计时锁定

app = Flask(__name__)
app.secret_key = "simple_secret_key_2026_ak_super_admin"  # 轻微升级密钥
from datetime import timedelta  # 必须导入timedelta
app.permanent_session_lifetime = timedelta(hours=1)
CORS(app, supports_credentials=True)

# 🔥 超级管理员账号（替换为你的高强度密码）
VALID_USERS = {
    "ak": {"password": "AkAdmin@2026#Pro", "role": "super_admin"}
}

# 登录失败次数追踪（全局变量，本地部署足够用）
login_attempts = {}
MAX_ATTEMPTS = 5  # 最大失败次数
LOCKOUT_TIME = 900  # 锁定时间：900秒=15分钟

# 登录接口（增加防暴力破解逻辑）
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    # 步骤1：校验是否是唯一管理员账号，非ak直接拒绝
    if username not in VALID_USERS:
        return jsonify({"success": False, "message": "无此账号，无登录权限！"})
    
    # 步骤2：检查账号是否被锁定
    if username in login_attempts:
        attempts = login_attempts[username]['attempts']
        last_attempt = login_attempts[username]['last_attempt']
        # 失败次数超限制 + 锁定时间未到 → 拒绝登录
        if attempts >= MAX_ATTEMPTS and (time.time() - last_attempt) < LOCKOUT_TIME:
            remaining = int(LOCKOUT_TIME - (time.time() - last_attempt)) // 60
            return jsonify({"success": False, "message": f"连续5次密码错误，账号锁定15分钟！剩余{remaining}分钟"})
        # 锁定时间已到 → 重置失败次数
        elif attempts >= MAX_ATTEMPTS and (time.time() - last_attempt) >= LOCKOUT_TIME:
            login_attempts.pop(username)

    # 步骤3：校验密码
    if VALID_USERS[username]["password"] == password:
        # 密码正确 → 重置失败次数，保存登录态
        login_attempts.pop(username, None)
        session['username'] = username
        session['role'] = VALID_USERS[username]["role"]
        return jsonify({
            "success": True, 
            "message": "超级管理员登录成功！", 
            "user": username,
            "role": VALID_USERS[username]["role"]
        })
    else:
        # 密码错误 → 记录失败次数和时间
        if username not in login_attempts:
            login_attempts[username] = {"attempts": 1, "last_attempt": time.time()}
        else:
            login_attempts[username]["attempts"] += 1
            login_attempts[username]["last_attempt"] = time.time()
        remaining = MAX_ATTEMPTS - login_attempts[username]["attempts"]
        return jsonify({"success": False, "message": f"密码错误！剩余{remaining}次尝试机会"})

# 校验登录态+权限
@app.route('/api/check', methods=['GET'])
def check_login():
    if 'username' in session and session['role'] == 'super_admin':
        return jsonify({
            "is_login": True, 
            "username": session['username'],
            "role": session.get('role', '')
        })
    return jsonify({"is_login": False, "role": ""})

# 退出登录
@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    session.pop('role', None)
    return jsonify({"success": True, "message": "退出登录成功！"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
