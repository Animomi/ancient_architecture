"""
AI 助手 API 路由模块
使用 DeepSeek API 实现流式聊天功能
"""

import os
import json
from flask import Blueprint, request, jsonify, Response
from supabase_client import supabase

ai_chat_bp = Blueprint('ai_chat', __name__)


def get_deepseek_client():
    """获取 DeepSeek API 客户端"""
    try:
        from openai import OpenAI
    except ImportError:
        return None

    api_key = os.environ.get('DEEPSEEK_API_KEY')
    api_url = os.environ.get('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1')

    if not api_key:
        return None

    return OpenAI(api_key=api_key, base_url=api_url)


@ai_chat_bp.route('/chat', methods=['POST'])
def chat():
    """处理 AI 聊天请求（流式）"""
    try:
        data = request.get_json()
        messages = data.get('messages', [])

        if not messages:
            return jsonify({'error': '请提供对话内容'}), 400

        # 系统提示词
        system_prompt = {
            'role': 'system',
            'content': '''你是古建筑知识专家助手，专门回答与中国传统建筑相关的问题。
你可以讨论：
- 各类建筑的历史背景和特点（宫殿、庙宇、民居、园林等）
- 建筑构造和工艺（斗拱、榫卯、彩画等）
- 建筑文化和象征意义
- 不同朝代和地区的建筑风格差异

请用专业、生动的方式回答，并适当引用历史典故和文化背景。
回答语言使用中文。'''
        }

        full_messages = [system_prompt] + messages

        client = get_deepseek_client()

        if not client:
            return jsonify({'error': 'AI 服务未配置'}), 503

        def generate():
            """生成流式响应"""
            try:
                stream = client.chat.completions.create(
                    model='deepseek-chat',
                    messages=full_messages,
                    stream=True,
                    temperature=0.7,
                    max_tokens=1000
                )

                for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        yield f"data: {json.dumps({'content': content}, ensure_ascii=False)}\n\n"

                yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@ai_chat_bp.route('/chat/simple', methods=['POST'])
def chat_simple():
    """处理 AI 聊天请求（非流式）"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': '请提供对话内容'}), 400

        client = get_deepseek_client()

        if not client:
            return jsonify({'error': 'AI 服务未配置'}), 503

        response = client.chat.completions.create(
            model='deepseek-chat',
            messages=[
                {
                    'role': 'system',
                    'content': '你是古建筑知识专家助手，专门回答与中国传统建筑相关的问题。请用中文回答。'
                },
                {
                    'role': 'user',
                    'content': user_message
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )

        answer = response.choices[0].message.content

        return jsonify({
            'message': answer,
            'usage': {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@ai_chat_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    """获取 AI 助手建议问题"""
    suggestions = [
        '故宫的太和殿有什么建筑特点？',
        '什么是斗拱结构？',
        '徽派建筑的白墙黛瓦有什么寓意？',
        '颐和园的建造历史是怎样的？',
        '中国传统建筑有哪些常见的屋顶形式？'
    ]

    return jsonify({
        'suggestions': suggestions
    }), 200


# 结尾 - Vercel 只使用 api/index.py 作为入口
