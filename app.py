from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "simple_secret_key_2026"
# 允许所有来源跨域，开发阶段最省心
CORS(app, supports_credentials=True)

# 预设账号，直接在这里添加或修改
VALID_USERS = {
    "ak": "2026",
    "admin": "admin123",
    "agent": "agent456"
}

# 登录接口
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in VALID_USERS and VALID_USERS[username] == password:
        session['username'] = username
        return jsonify({"success": True, "message": "登录成功", "user": username})
    return jsonify({"success": False, "message": "账号或密码错误"})

# 校验登录态
@app.route('/api/check', methods=['GET'])
def check_login():
    if 'username' in session:
        return jsonify({"is_login": True, "username": session['username']})
    return jsonify({"is_login": False})

# 退出登录
@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return jsonify({"success": True, "message": "已退出登录"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
