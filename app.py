from flask import Flask, request, jsonify, session
from flask_cors import CORS
import secrets

app = Flask(__name__)
# 配置session密钥（必须，用于加密登录态，随便写一串字符即可）
app.secret_key = secrets.token_hex(16)
# 允许跨域+携带cookie（关键，实现登录态保持）
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500"])  # 前端运行地址

# 预设账号：支持管理后台/代理账号，后续可直接加
VALID_USERS = {
    "ak": "2026",        # 原测试账号
    "admin": "admin123", # 管理后台账号
    "agent": "agent456"  # 代理账号
}

# 登录接口
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # 验证账号密码
    if username in VALID_USERS and VALID_USERS[username] == password:
        # 登录成功：设置session（登录态），保存用户名
        session['username'] = username
        return jsonify({
            "success": True,
            "message": "登录成功！即将跳转到管理后台",
            "user": username
        })
    else:
        return jsonify({
            "success": False,
            "message": "账号或密码错误！请重新输入"
        })

# 校验登录态接口（给管理页用，防止直接访问）
@app.route('/api/check-login', methods=['GET'])
def check_login():
    # 判断session中是否有用户名，有则已登录
    if 'username' in session:
        return jsonify({
            "is_login": True,
            "username": session['username']
        })
    else:
        return jsonify({
            "is_login": False
        })

# 退出登录接口
@app.route('/api/logout', methods=['GET'])
def logout():
    # 清除session，销毁登录态
    session.pop('username', None)
    return jsonify({
        "success": True,
        "message": "退出登录成功！"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # 固定端口5000，和前端请求地址一致
