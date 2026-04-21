"""
Supabase 后端单例客户端
用于 Flask API 与 Supabase 后端通信
"""

import os
from supabase import create_client, Client

# 懒加载单例客户端
_supabase_client: Client = None


def get_supabase_client() -> Client:
    """获取 Supabase 客户端单例"""
    global _supabase_client

    if _supabase_client is None:
        supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

        if not supabase_url or not supabase_key:
            raise ValueError('缺少 Supabase 配置，请设置 SUPABASE_URL 和 SUPABASE_KEY 环境变量')

        _supabase_client = create_client(supabase_url, supabase_key)

    return _supabase_client


# 导出单例客户端供其他模块使用
supabase = get_supabase_client()
