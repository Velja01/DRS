from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from database.ReadPosts import get_posts_data
from database.ReadUsers import get_users_data
from views import views


app = Flask(__name__, static_url_path="/assets",
            static_folder="assets", template_folder="template")
CORS(app)
 
@app.route("/LogIn")
def LogIn():
    return render_template("login/index.html");

@app.get("/api/posts")
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

@app.get("/api/login")
def login():
    users_data=get_users_data()

    users = [
    {
        "id": user.id,
        "ime": user.ime,
        "prezime": user.prezime,
        "adresa": user.adresa,
        "grad": user.grad,
        "drzava": user.drzava,
        "broj_telefona": user.broj_telefona,
        "email": user.email,
        "lozinka": user.lozinka
    } for user in users_data
]
    
    return jsonify(
       {"users":users}
    )

@app.get("/")
def getHome():
    return render_template("pocetna/index.html")
if __name__=="__main__":
    app.run(debug=True)
