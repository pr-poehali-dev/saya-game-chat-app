import json
import os
import psycopg2

def handler(event, context):
    """
    Инициализация базы подарков (1000 вариантов разных категорий и стоимости)
    Создаёт подарки с эмодзи, ценами и редкостью
    """
    method = event.get('httpMethod', 'GET')
    
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
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    gifts_data = []
    
    categories = {
        'common': {'emojis': ['❤️', '👍', '😊', '🌟', '✨', '💫', '⭐', '🎈', '🎉', '🎊'], 'price_range': (10, 50), 'rarity': 'common'},
        'food': {'emojis': ['🍕', '🍔', '🍟', '🌮', '🍰', '🍪', '🍩', '🧁', '🍦', '🍫', '🍬', '🍭', '🥤', '☕', '🧃'], 'price_range': (20, 80), 'rarity': 'common'},
        'animals': {'emojis': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'], 'price_range': (50, 150), 'rarity': 'uncommon'},
        'nature': {'emojis': ['🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌾', '🌲', '🌴', '🌵', '🌊', '⛰️', '🔥', '💧'], 'price_range': (30, 100), 'rarity': 'common'},
        'vehicles': {'emojis': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚛', '🚜', '🏍️', '🚲', '✈️'], 'price_range': (100, 500), 'rarity': 'rare'},
        'sports': {'emojis': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍'], 'price_range': (80, 200), 'rarity': 'uncommon'},
        'music': {'emojis': ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🥁', '🎺', '🎷', '🎻', '🪕', '🎼', '🎙️', '📻', '🔊'], 'price_range': (100, 300), 'rarity': 'rare'},
        'luxury': {'emojis': ['💎', '💍', '👑', '🏆', '🥇', '🥈', '🥉', '🎖️', '🏅', '🎗️', '💰', '💵', '💴', '💶', '💷'], 'price_range': (500, 2000), 'rarity': 'epic'},
        'tech': {'emojis': ['💻', '📱', '⌚', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '📹', '🎮', '🕹️', '🎧', '📡', '🔋', '💾'], 'price_range': (200, 800), 'rarity': 'rare'},
        'magic': {'emojis': ['🔮', '🎩', '🪄', '✨', '💫', '⚡', '🌙', '☀️', '🌈', '🦄', '🧚', '🧙', '🧞', '🧜', '🐲'], 'price_range': (300, 1000), 'rarity': 'epic'},
        'legendary': {'emojis': ['👾', '🛸', '🚀', '🌌', '🔱', '⚔️', '🗡️', '🛡️', '🏰', '🎆', '🎇', '🌠', '💥', '🔥', '❄️'], 'price_range': (1000, 5000), 'rarity': 'legendary'},
    }
    
    gift_names = {
        'common': ['Лайк', 'Улыбка', 'Звезда', 'Блеск', 'Сердце', 'Поддержка'],
        'food': ['Пицца', 'Бургер', 'Торт', 'Кофе', 'Коктейль', 'Сладость'],
        'animals': ['Котик', 'Собачка', 'Панда', 'Лисичка', 'Мишка', 'Зайка'],
        'nature': ['Роза', 'Цветок', 'Дерево', 'Океан', 'Огонь', 'Лёд'],
        'vehicles': ['Машина', 'Спорткар', 'Байк', 'Самолёт', 'Вертолёт', 'Яхта'],
        'sports': ['Мяч', 'Медаль', 'Кубок', 'Победа', 'Чемпион', 'Рекорд'],
        'music': ['Гитара', 'Микрофон', 'Наушники', 'Концерт', 'Хит', 'Альбом'],
        'luxury': ['Бриллиант', 'Корона', 'Трон', 'Сокровище', 'Золото', 'Богатство'],
        'tech': ['Гаджет', 'Ноутбук', 'Смартфон', 'Консоль', 'Камера', 'Дрон'],
        'magic': ['Магия', 'Заклинание', 'Единорог', 'Звёздная пыль', 'Волшебство', 'Чудо'],
        'legendary': ['Легенда', 'Космос', 'Галактика', 'Меч героя', 'Божество', 'Эпик'],
    }
    
    gift_id = 1
    for category, data in categories.items():
        emojis = data['emojis']
        price_min, price_max = data['price_range']
        rarity = data['rarity']
        names = gift_names.get(category, ['Подарок'])
        
        items_per_category = len(emojis) * len(names)
        
        for emoji in emojis:
            for name in names:
                for variant in range(1, 11):
                    if gift_id > 1000:
                        break
                    
                    price = price_min + ((price_max - price_min) * variant // 10)
                    full_name = f"{name} {variant}" if variant > 1 else name
                    
                    gifts_data.append((full_name, emoji, price, category, rarity))
                    gift_id += 1
                
                if gift_id > 1000:
                    break
            if gift_id > 1000:
                break
        if gift_id > 1000:
            break
    
    cur.execute("SELECT COUNT(*) FROM gifts")
    count = cur.fetchone()[0]
    
    if count == 0:
        insert_query = "INSERT INTO gifts (name, emoji, price, category, rarity) VALUES (%s, %s, %s, %s, %s)"
        cur.executemany(insert_query, gifts_data)
        conn.commit()
        message = f"Initialized {len(gifts_data)} gifts"
    else:
        message = f"Gifts already initialized ({count} gifts exist)"
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': message, 'count': len(gifts_data)}),
        'isBase64Encoded': False
    }
