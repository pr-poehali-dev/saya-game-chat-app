import json
import os
import psycopg2
from datetime import datetime

def handler(event, context):
    """
    API для работы с пользователем: создание, получение баланса, обновление
    GET /?user_id=123 - получить данные
    POST body: {user_id, username, avatar} - создать/обновить
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        user_id = params.get('user_id')
        
        if not user_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user_id required'}),
                'isBase64Encoded': False
            }
        
        cur.execute("""
            SELECT user_id, username, avatar, balance, total_spent, score, wins, created_at
            FROM users WHERE user_id = %s
        """, (user_id,))
        
        row = cur.fetchone()
        
        if not row:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'User not found'}),
                'isBase64Encoded': False
            }
        
        user = {
            'user_id': row[0],
            'username': row[1],
            'avatar': row[2],
            'balance': row[3],
            'total_spent': row[4],
            'score': row[5],
            'wins': row[6],
            'created_at': row[7].isoformat() if row[7] else None
        }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'user': user}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('user_id')
        username = body_data.get('username')
        avatar = body_data.get('avatar', '🎮')
        
        if not user_id or not username:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user_id and username required'}),
                'isBase64Encoded': False
            }
        
        cur.execute("""
            INSERT INTO users (user_id, username, avatar)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET username = EXCLUDED.username, avatar = EXCLUDED.avatar, updated_at = CURRENT_TIMESTAMP
            RETURNING user_id, username, avatar, balance, total_spent, score, wins
        """, (user_id, username, avatar))
        
        row = cur.fetchone()
        conn.commit()
        
        user = {
            'user_id': row[0],
            'username': row[1],
            'avatar': row[2],
            'balance': row[3],
            'total_spent': row[4],
            'score': row[5],
            'wins': row[6]
        }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'user': user}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
