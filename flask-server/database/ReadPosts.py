from classes.post import Post
import mysql.connector

def get_posts_data():
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    select_posts_query = "SELECT id, title, content, author, created_at, upvotes, downvotes, comments, user_id, allowcomms FROM Posts"
    cursor.execute(select_posts_query)

    posts_data = []
    for (post_id, title, content, author, created_at, upvotes, downvotes, comments, user_id, allowcomms) in cursor.fetchall():
        post = Post(post_id, title, content, author, created_at, upvotes, downvotes, comments, user_id, allowcomms)
        posts_data.append(post)

    cursor.close()
    connection.close()

    return posts_data
