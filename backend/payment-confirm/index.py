import json
import os
import psycopg2

def handler(event, context):
    """
    Webhook для подтверждения платежа (callback от ЮKassa)
    POST body: {payment_id, status}
    Обновляет баланс пользователя при успешной оплате
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    payment_id = body_data.get('payment_id')
    status = body_data.get('status', 'failed')
    
    if not payment_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'payment_id required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute("""
        SELECT user_id, amount, status FROM transactions
        WHERE payment_id = %s
    """, (payment_id,))
    
    row = cur.fetchone()
    
    if not row:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Transaction not found'}),
            'isBase64Encoded': False
        }
    
    user_id, amount, current_status = row
    
    if current_status == 'completed':
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Already processed'}),
            'isBase64Encoded': False
        }
    
    if status == 'succeeded' or status == 'completed':
        cur.execute("""
            UPDATE transactions 
            SET status = 'completed'
            WHERE payment_id = %s
        """, (payment_id,))
        
        cur.execute("""
            UPDATE users
            SET balance = balance + %s, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = %s
            RETURNING balance
        """, (amount, user_id))
        
        new_balance = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': 'Payment confirmed',
                'new_balance': new_balance
            }),
            'isBase64Encoded': False
        }
    else:
        cur.execute("""
            UPDATE transactions 
            SET status = 'failed'
            WHERE payment_id = %s
        """, (payment_id,))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'message': 'Payment failed'}),
            'isBase64Encoded': False
        }
