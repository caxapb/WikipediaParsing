import psycopg2
import json
import os

db_config = {
    'dbname': 'wiki',
    'user': 'superuser',
    'password': '12345678',
    'host': 'localhost',
    'port': 5432
}

connection = psycopg2.connect(**db_config)
cursor = connection.cursor()

cursor.execute('SELECT * FROM films')
rows = cursor.fetchall()

films = []
for row in rows:
    films.append({
        'id': row[0],
        'title': row[1],
        'year': row[2],
        'director': row[3],
        'revenue': row[4],
        'country': row[5],
        'poster': row[6]
    })

path = os.path.dirname(os.path.abspath(__file__))
with open(path + '/films.json', 'w') as f:
    json.dump(films, f)

cursor.close()
connection.close()