import json
import os
import psycopg2

def handler(event, context):
    """
    API для получения списка подарков с фильтрацией и пагинацией
    GET /?category=luxury&rarity=epic&page=1&limit=20
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    category = params.get('category')
    rarity = params.get('rarity')
    page = int(params.get('page', 1))
    limit = int(params.get('limit', 20))
    offset = (page - 1) * limit
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    where_clauses = []
    query_params = []
    
    if category:
        where_clauses.append("category = %s")
        query_params.append(category)
    
    if rarity:
        where_clauses.append("rarity = %s")
        query_params.append(rarity)
    
    where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
    
    count_query = f"SELECT COUNT(*) FROM gifts{where_sql}"
    cur.execute(count_query, query_params)
    total = cur.fetchone()[0]
    
    query = f"""
        SELECT id, name, emoji, price, category, rarity 
        FROM gifts{where_sql}
        ORDER BY price ASC
        LIMIT %s OFFSET %s
    """
    
    cur.execute(query, query_params + [limit, offset])
    rows = cur.fetchall()
    
    gifts = []
    for row in rows:
        gifts.append({
            'id': row[0],
            'name': row[1],
            'emoji': row[2],
            'price': row[3],
            'category': row[4],
            'rarity': row[5]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'gifts': gifts,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        }),
        'isBase64Encoded': False
    }
