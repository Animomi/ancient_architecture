"""
建筑相关 API 路由模块
处理建筑列表、详情、分类等接口
"""

from flask import Blueprint, request, jsonify
from supabase_client import supabase

buildings_bp = Blueprint('buildings', __name__)


@buildings_bp.route('/', methods=['GET'])
def get_buildings():
    """获取建筑列表"""
    try:
        # 获取查询参数
        category_id = request.args.get('category_id')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 12))

        # 构建查询
        query = supabase.table('buildings').select('*, categories(name)')

        if category_id:
            query = query.eq('category_id', category_id)

        # 分页
        query = query.range((page - 1) * page_size, page * page_size - 1)

        response = query.execute()

        return jsonify({
            'buildings': response.data,
            'total': len(response.data),
            'page': page,
            'page_size': page_size
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@buildings_bp.route('/<building_id>', methods=['GET'])
def get_building(building_id):
    """获取建筑详情"""
    try:
        response = supabase.table('buildings').select('*, categories(name)').eq('id', building_id).execute()

        if response.data:
            return jsonify({'building': response.data[0]}), 200

        return jsonify({'error': '建筑不存在'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@buildings_bp.route('/categories', methods=['GET'])
def get_categories():
    """获取建筑分类"""
    try:
        response = supabase.table('categories').select('*').execute()

        return jsonify({
            'categories': response.data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@buildings_bp.route('/<building_id>/favorite', methods=['POST'])
def toggle_favorite(building_id):
    """收藏/取消收藏建筑"""
    try:
        # 获取当前用户（直接调用 Supabase）
        auth_response = supabase.auth.get_user()
        if not auth_response.user:
            return jsonify({'error': '请先登录'}), 401

        user_id = auth_response.user.id

        # 检查是否已收藏
        existing = supabase.table('favorites').select('*').eq('user_id', user_id).eq('building_id', building_id).execute()

        if existing.data:
            # 取消收藏
            supabase.table('favorites').delete().eq('id', existing.data[0]['id']).execute()
            return jsonify({'message': '已取消收藏', 'favorited': False}), 200
        else:
            # 添加收藏
            supabase.table('favorites').insert({
                'user_id': user_id,
                'building_id': building_id
            }).execute()
            return jsonify({'message': '已收藏', 'favorited': True}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@buildings_bp.route('/<building_id>/3d-model', methods=['GET'])
def get_3d_model(building_id):
    """获取建筑的 3D 模型信息"""
    try:
        response = supabase.table('buildings').select('id, name, model_url').eq('id', building_id).execute()

        if response.data:
            return jsonify({
                'model': response.data[0]
            }), 200

        return jsonify({'error': '建筑或模型不存在'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 结尾 - Vercel 只使用 api/index.py 作为入口
