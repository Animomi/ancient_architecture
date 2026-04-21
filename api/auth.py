"""
认证路由模块
处理用户注册、登录等认证功能
"""

from flask import Blueprint, request, jsonify
from supabase_client import supabase

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')

        if not email or not password or not username:
            return jsonify({'error': '请提供完整的注册信息'}), 400

        # 使用 Supabase Auth 创建用户
        auth_response = supabase.auth.sign_up({
            'email': email,
            'password': password,
            'options': {
                'data': {
                    'username': username
                }
            }
        })

        if auth_response.user:
            # 在 users 表中创建用户记录
            user_response = supabase.table('users').insert({
                'id': auth_response.user.id,
                'email': email,
                'username': username
            }).execute()

            return jsonify({
                'message': '注册成功',
                'user': {
                    'id': auth_response.user.id,
                    'email': email,
                    'username': username
                },
                'session': auth_response.session
            }), 201

        return jsonify({'error': '注册失败'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': '请提供邮箱和密码'}), 400

        # 使用 Supabase Auth 登录
        auth_response = supabase.auth.sign_in_with_password({
            'email': email,
            'password': password
        })

        if auth_response.user:
            # 获取用户完整信息
            user_response = supabase.table('users').select('*').eq('id', auth_response.user.id).execute()

            return jsonify({
                'message': '登录成功',
                'user': {
                    'id': auth_response.user.id,
                    'email': auth_response.user.email,
                    'username': user_response.data[0].get('username') if user_response.data else None
                },
                'session': auth_response.session
            }), 200

        return jsonify({'error': '登录失败'}), 401

    except Exception as e:
        return jsonify({'error': '邮箱或密码错误'}), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """用户登出"""
    try:
        supabase.auth.sign_out()
        return jsonify({'message': '登出成功'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """获取当前用户信息"""
    try:
        auth_response = supabase.auth.get_user()

        if auth_response.user:
            user_response = supabase.table('users').select('*').eq('id', auth_response.user.id).execute()

            return jsonify({
                'user': {
                    'id': auth_response.user.id,
                    'email': auth_response.user.email,
                    'username': user_response.data[0].get('username') if user_response.data else None
                }
            }), 200

        return jsonify({'error': '未登录'}), 401

    except Exception as e:
        return jsonify({'error': '未登录'}), 401


# 结尾 - Vercel 只使用 api/index.py 作为入口
