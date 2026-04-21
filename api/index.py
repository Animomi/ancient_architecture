"""
Flask 应用入口 - Vercel Python Serverless Functions
古建筑后端 API
"""

from flask import Flask, request, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)

# 在 Vercel 环境下启用 ProxyFix（解决代理问题）
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# 启用 CORS（如果需要跨域请求）
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response


# 路由导入
from auth import auth_bp
from buildings import buildings_bp
from knowledge import knowledge_bp
from ai_chat import ai_chat_bp

# 注册蓝图
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(buildings_bp, url_prefix='/api/buildings')
app.register_blueprint(knowledge_bp, url_prefix='/api/knowledge')
app.register_blueprint(ai_chat_bp, url_prefix='/api/ai')


@app.route('/')
def index():
    """API 根路由"""
    return jsonify({
        'message': '古建筑 API 服务运行中',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'buildings': '/api/buildings',
            'knowledge': '/api/knowledge',
            'ai': '/api/ai'
        }
    })


@app.route('/api')
def api_info():
    """API 信息端点"""
    return jsonify({
        'name': '古建筑后端API',
        'status': 'running',
        'docs': '/api/docs'
    })


# Vercel Serverless Functions 需要导出 app
# 注意：不要使用 app.run()
