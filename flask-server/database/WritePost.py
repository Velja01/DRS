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

def changePostInfo(post_id, likeDislike):
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Proveri da li je vrednost likeDislike 'like' ili 'dislike'
    if likeDislike not in ['like', 'dislike']:
        # Ako nije ni 'like' ni 'dislike', baci izuzetak ili obradi grešku na odgovarajući način
        raise ValueError("Vrednost likeDislike mora biti 'like' ili 'dislike'.")

    # Na osnovu vrednosti likeDislike, izaberi odgovarajući operator (+1 za like, -1 za dislike)
    operator = '+' if likeDislike == 'like' else '-'

    # SQL upit za ažuriranje vrednosti upvotes za određeni post
    update_upvotes_query = f"""
    UPDATE posts
    SET upvotes = upvotes {operator} 1
    WHERE id = %s
    """

    # Izvrši upit za ažuriranje
    cursor.execute(update_upvotes_query, (post_id,))

    # Potvrdi promene u bazi
    connection.commit()

    # Zatvori kursor i konekciju
    cursor.close()
    connection.close()
