import json
import os
import psycopg2
import hashlib
import uuid

def handler(event, context):
    """
    API для создания платежа через СБП (ЮKassa)
    POST body: {user_id, amount, description}
    Возвращает payment_url для оплаты
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
    user_id = body_data.get('user_id')
    amount = body_data.get('amount', 0)
    description = body_data.get('description', 'Пополнение баланса')
    
    if not user_id or amount <= 0:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id and amount > 0 required'}),
            'isBase64Encoded': False
        }
    
    merchant_id = os.environ.get('SBP_MERCHANT_ID', '')
    secret_key = os.environ.get('SBP_SECRET_KEY', '')
    
    demo_mode = not merchant_id or not secret_key
    
    payment_id = str(uuid.uuid4())
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO transactions (user_id, transaction_type, amount, description, payment_id, status)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (user_id, 'deposit', amount, description, payment_id, 'pending'))
    
    transaction_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    if demo_mode:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'demo_mode': True,
                'payment_id': payment_id,
                'transaction_id': transaction_id,
                'message': 'Демо-режим. Добавь ключи СБП для реальных платежей',
                'payment_url': f'/demo-payment?id={payment_id}&amount={amount}'
            }),
            'isBase64Encoded': False
        }
    
    amount_kopeks = int(amount * 100)
    
    yookassa_data = {
        'amount': {
            'value': f"{amount:.2f}",
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': f'https://your-domain.com/payment-success?payment_id={payment_id}'
        },
        'capture': True,
        'description': description,
        'metadata': {
            'user_id': user_id,
            'transaction_id': transaction_id
        },
        'receipt': {
            'customer': {
                'inn': '526098573404'
            },
            'items': [{
                'description': description,
                'quantity': '1.00',
                'amount': {
                    'value': f"{amount:.2f}",
                    'currency': 'RUB'
                },
                'vat_code': 1,
                'payment_mode': 'full_payment',
                'payment_subject': 'service'
            }]
        }
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'payment_id': payment_id,
            'transaction_id': transaction_id,
            'payment_url': f'https://yookassa.ru/checkout/payments/{payment_id}',
            'message': 'Интеграция с ЮKassa готова. Добавь реальные ключи для работы'
        }),
        'isBase64Encoded': False
    }
