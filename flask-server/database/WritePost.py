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
    INSERT INTO posts (title, content, author, created_at, upvotes, downvotes, comments, user_id, allowcomms, likes) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
    post.user_id,
    True,
    0

    )


    # Izvrši upit za unos posta
    cursor.execute(insert_post_query, post_data)

    # Potvrdi promene u bazi
    connection.commit()
    update=f"update posts set joined=JSON_ARRAY(), allcomms=JSON_ARRAY() where joined is NULL and allcomms is NULL"
    cursor.execute(update);
    connection.commit()
    # Zatvori kursor i konekciju
    cursor.close()
    connection.close()

def changePostInfo():
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # SQL upit za ažuriranje upvotes u posts na osnovu vrednosti iz likes
    update_upvotes_query = """
    UPDATE posts
    SET upvotes = COALESCE((SELECT SUM(likes) FROM likes WHERE likes.postid = posts.id), 0)
    """

    # Izvrši upit za ažuriranje
    cursor.execute(update_upvotes_query)

    # Potvrdi promene u bazi
    connection.commit()

    # Zatvori kursor i konekciju
    cursor.close()
    connection.close()