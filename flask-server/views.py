from flask import Blueprint, jsonify, render_template
from database.ReadPosts import get_posts_data
from classes.post import Post
views = Blueprint(__name__, "views")

# Primer podataka (za ilustraciju)
#posts_data = get_posts_data()

@views.post("/")
def home():
    posts_data = get_posts_data()
    posts = [
    {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "author": post.author,
        "created_at": post.created_at,
        "upvotes": post.upvotes,
        "downvotes": post.downvotes,
        "comments": post.comments
    } for post in posts_data
    ]

    return jsonify({"posts": posts})
@views.get("/")
def getHome():
    return render_template("C:/Users/veljk/Desktop/drsvezba/drsvezba/flask-server/template/pocetna/index.html")