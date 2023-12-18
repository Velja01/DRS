import datetime
import mysql.connector
from classes.post import Post

# ...

def insert_post(post):
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # SQL upit za unos posta (preskače se polje 'id' jer je auto increment)
    insert_post_query = """
    INSERT INTO posts (title, content, author, created_at, upvotes, downvotes, comments, user_id) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

    
    # Dohvati tuple vrednosti iz objekta posta
    post_data = (
    post.title,
    post.content,
    post.author,
    post.created_at,  # Pretvaranje u string
    post.upvotes,
    post.downvotes,
    0,
    post.user_id
    )


    # Izvrši upit za unos posta
    cursor.execute(insert_post_query, post_data)

    # Potvrdi promene u bazi
    connection.commit()

    # Zatvori kursor i konekciju
    cursor.close()
    connection.close()
