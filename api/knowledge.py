"""
建筑知识文章 API 路由模块
处理知识文章列表、详情等接口
"""

from flask import Blueprint, request, jsonify
from supabase_client import supabase

knowledge_bp = Blueprint('knowledge', __name__)


@knowledge_bp.route('/', methods=['GET'])
def get_articles():
    """获取知识文章列表"""
    try:
        category = request.args.get('category')
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 10))

        query = supabase.table('knowledge_articles').select('*')

        if category:
            query = query.eq('category', category)

        query = query.order('created_at', desc=True).range((page - 1) * page_size, page * page_size - 1)

        response = query.execute()

        return jsonify({
            'articles': response.data,
            'total': len(response.data),
            'page': page,
            'page_size': page_size
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@knowledge_bp.route('/<article_id>', methods=['GET'])
def get_article(article_id):
    """获取文章详情"""
    try:
        response = supabase.table('knowledge_articles').select('*').eq('id', article_id).execute()

        if response.data:
            # 增加阅读量
            article = response.data[0]
            supabase.table('knowledge_articles').update({
                'view_count': article.get('view_count', 0) + 1
            }).eq('id', article_id).execute()

            return jsonify({'article': article}), 200

        return jsonify({'error': '文章不存在'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@knowledge_bp.route('/categories', methods=['GET'])
def get_knowledge_categories():
    """获取知识分类"""
    try:
        response = supabase.table('knowledge_categories').select('*').execute()

        return jsonify({
            'categories': response.data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@knowledge_bp.route('/featured', methods=['GET'])
def get_featured_articles():
    """获取精选文章"""
    try:
        response = supabase.table('knowledge_articles').select('*').eq('is_featured', True).limit(6).execute()

        return jsonify({
            'articles': response.data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# 结尾 - Vercel 只使用 api/index.py 作为入口
