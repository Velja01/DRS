import json
from flask import Flask, g, request, jsonify, render_template
from flask_cors import CORS
from flask_mail import Mail, Message
import mysql
from database.ReadPosts import get_posts_data
from database.ReadUsers import get_users_data
from database.WritePost import insert_post, changePostInfo
from views import views
from classes.user import User
from classes.post import Post
from database.WriteUser import insert_user, update_user
app = Flask(__name__, static_url_path="/assets",
            static_folder="assets", template_folder="template")
CORS(app)

myconn = mysql.connector.connect(host = "localhost", user = "root",passwd = "password123", database = "RedditBase")  

# Postavke za Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'veljkoklincov99@gmail.com'
app.config['MAIL_PASSWORD'] = 'qhqi udwe zkva sykx'
app.config['MAIL_DEFAULT_SENDER'] = 'veljkoklincov99@gmail.com'

mail = Mail(app)


app.config['logged_user'] = None  
@app.get("/")
def getHome():
    return render_template("pocetna/index.html")
@app.route("/LogIn")
def LogIn():
    return render_template("login/index.html");
@app.route("/SignUp")
def SignUp():
    return render_template("signup/index.html");
@app.route("/UserInfo")
def UserInfo():
    return render_template("userinfo/index.html");
@app.route("/AddTheme")
def AddTheme():
    return render_template("addtheme/index.html")
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
        "comments": post.comments,
        "user_id":post.user_id,
        "allowcomms":post.allowcomms,
        "allcomms":post.allcomms
    } for post in posts_data
    ]

    return jsonify({"posts": posts})

@app.route("/api/login", methods=['POST', 'GET'])
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
    data=request.get_json()
    username=data.get('username')
    password=data.get('password')

    pronadjenMail =False;
    pronadjenPass=False;
    message="";
    for user in users:
        if user["email"]==username:
            pronadjenMail=True;
            if user["lozinka"]==password:
                pronadjenPass=True;
                g.current_user=user;
                app.config['logged_user']=user
                print(g.current_user['id'])
    if not pronadjenMail:
        message= "Korisnik sa tim username-om ne postoji u bazi podataka"
    
    if not pronadjenPass:
        message= "Korisnik sa tim password-om ne postoji u bazi podataka"
    if pronadjenMail and pronadjenPass:
        return jsonify(message="uspesno")
    return jsonify(
       message=message
    )
@app.route("/api/signup", methods=['POST'])
def signup():
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
    user_data=request.get_json();
    print(user_data)
    
    u=User(
    user_data.get('userData', {}).get('id'),
    user_data.get('userData', {}).get('ime'),
    user_data.get('userData', {}).get('prezime'),
    user_data.get('userData', {}).get('adresa'),
    user_data.get('userData', {}).get('grad'),
    user_data.get('userData', {}).get('drzava'),
    user_data.get('userData', {}).get('broj_telefona'),
    user_data.get('userData', {}).get('email'),
    user_data.get('userData', {}).get('lozinka')
    )
    print(u.ime)
    
    if (
        u.ime == "" or
        u.prezime == "" or
        u.adresa == ""  or
        u.grad == ""  or
        u.drzava == ""  or
        u.broj_telefona == ""  or
        u.email == ""  or
        u.lozinka == "" 
        ):
            return jsonify(message="morate popuniti sva polja");
        
    for existing_user in users:
        if existing_user["email"] ==u.email:
            return jsonify(message="Korisnik sa ovim email-om već postoji.")
    
    insert_user(u);

    return jsonify(message="Korisnik je uspesno kreiran");

@app.route("/api/getuser", methods=['GET'])
def getUser():
    
    return jsonify(
        {"user":app.config['logged_user']}
    )
@app.route("/api/changeuserinfo", methods=['POST'])
def changeUserInfo():

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

    user_data=request.get_json();
    print(user_data)
    
    u=User(
    user_data.get('userData', {}).get('id'),
    user_data.get('userData', {}).get('ime'),
    user_data.get('userData', {}).get('prezime'),
    user_data.get('userData', {}).get('adresa'),
    user_data.get('userData', {}).get('grad'),
    user_data.get('userData', {}).get('drzava'),
    user_data.get('userData', {}).get('broj_telefona'),
    user_data.get('userData', {}).get('email'),
    user_data.get('userData', {}).get('lozinka')
    )
    print(u.ime)
    for existing_user in users:
        if existing_user["id"] ==u.id:
            existing_user["ime"] = u.ime
            existing_user["prezime"] = u.prezime
            existing_user["adresa"] = u.adresa
            existing_user["grad"] = u.grad
            existing_user["drzava"] = u.drzava
            existing_user["broj_telefona"] = u.broj_telefona
            existing_user["email"] = u.email
            existing_user["lozinka"] = u.lozinka

    update_user(u)
    return jsonify(message="Izmenili ste vrednosti korisnika")
@app.route("/api/sharepost", methods=['POST'])
def sharePost():
    mycursor = myconn.cursor()
    users=get_users_data()
    request_post=request.get_json();
    
    print(request_post)
    
    
    p=Post(
    request_post.get('Post', {}).get('id'),
    request_post.get('Post', {}).get('title'),
    request_post.get('Post', {}).get('content'),
    request_post.get('Post', {}).get('author'),
    request_post.get('Post', {}).get('created_at'),
    request_post.get('Post', {}).get('upvotes'),
    request_post.get('Post', {}).get('downvotes'),
    request_post.get('Post', {}).get('comments'),
    request_post.get('Post', {}).get('user_id'),
    True,
    request_post.get('Post', {}).get('allcomms')
    )
    
    insert_post(p);
    add_into_likes(p.id);
    for user in users:
        send_post_email(user.email, p)
    
    return jsonify(message="Post je uspesno kriran i upisan u bazu")
def add_into_likes(id):
    mycursor = myconn.cursor()
    select_query = "SELECT * FROM posts ORDER BY id DESC LIMIT 1"

    # Izvršavanje SQL upita
    mycursor.execute(select_query)

    # Dohvatanje rezultata upita
    result = mycursor.fetchone()
    print(result)
    insert_query = "INSERT INTO likes (postid, likes, upvotes, downvotes) VALUES (%s, 0, '[]', '[]')"


    mycursor.execute(insert_query, (result[0],))

        # Potvrda izvršenja promena u bazi podataka
    myconn.commit()
    # Zatvaranje kursora i veze
    mycursor.close()
    myconn.close()

    
@app.route("/api/posts/vote", methods=['POST'])
def votes():
    userid=app.config['logged_user']['id']
    request_data=request.get_json();
    postId=request_data.get('id')
    postVote=request_data.get('likeDislike')
    if(app.config['logged_user']) is not None:
        
        addLike(postId, userid, postVote)
        changePostInfo()
        return jsonify(message="radi")
        
    if app.config['logged_user'] is None:
        return jsonify(message="ne_radi")
    return jsonify(message="ne_radi")
def checkinfo(userid, postid):
    mycursor = myconn.cursor()
    select_query = "SELECT * FROM likes WHERE JSON_CONTAINS(upvotes, %s) AND postid=%s"
    mycursor.execute(select_query, (json.dumps(userid),postid))

    result = mycursor.fetchall()

    mycursor.close()

    if not result:
        return False
    else:
        return True
def addLike(postid, userid, postvote):
    mycursor = myconn.cursor()
    likeOrDislike = 'upvotes' if postvote == 'like' else 'downvotes'
    remove = 'downvotes' if postvote == 'like' else 'upvotes'
    operator = '+' if postvote == 'like' else '-'
    if checkinfo(userid, postid) is False:
        print({remove})
        update_query = f"UPDATE likes SET likes = likes {operator} 1, {likeOrDislike} = JSON_ARRAY_APPEND({likeOrDislike}, '$', %s), {remove} = CASE WHEN JSON_LENGTH({remove}) > 1 THEN JSON_REMOVE({remove}, CONCAT('$[', JSON_UNQUOTE(JSON_SEARCH({remove}, 'one', %s)), ']')) ELSE '[]' END WHERE postid = %s"
        mycursor.execute(update_query, (userid, userid, postid))
    if checkinfo(userid, postid) is True:
        if likeOrDislike=='downvotes':
            print({remove})
            update_query=f"UPDATE likes SET likes=likes {operator} 1, {likeOrDislike}=JSON_ARRAY_APPEND({likeOrDislike}, '$', %s), {remove} = CASE WHEN JSON_LENGTH({remove}) > 1 THEN JSON_REMOVE({remove}, CONCAT('$[', JSON_UNQUOTE(JSON_SEARCH({remove}, 'one', %s)), ']')) ELSE '[]' END WHERE postid = %s"
            mycursor.execute(update_query, (userid, userid, postid))
    myconn.commit()

@app.delete("/api/deletepost/<postId>")
def deletePost(postId):
    try:

        mycursor = myconn.cursor()
        delete_query = "DELETE FROM posts WHERE id = %s"
        mycursor.execute(delete_query, (postId,))

        myconn.commit()
        delete_query = "DELETE FROM likes WHERE postid = %s"
        mycursor.execute(delete_query, (postId,))

        myconn.commit()
        return jsonify(message=f"Post sa ID {postId} je uspešno obrisan.")
    except Exception as e:
        print("Greška pri brisanju posta:", e)
        return jsonify(message="Došlo je do greške pri brisanju posta.")
    finally:
        # Zatvorite kursor nakon što završite
        mycursor.close()
@app.put("/api/updateallowcomms/<postId>")
def updateAllowComms(postId):
    try:
        mycursor = myconn.cursor()
        print(postId)
        # Pretpostavljamo da vrednost za "allowcomms" dolazi kao JSON podaci u zahtevu
        data = request.get_json()
        allowcomms = data.get('allowcomms')
        print(allowcomms)   
        update_query = "UPDATE posts SET allowcomms = %s WHERE id = %s"
        mycursor.execute(update_query, (allowcomms, postId))

        myconn.commit()

        return jsonify(message=f"Vrednost allowcomms za post sa ID {postId} je uspešno ažurirana.")
    except Exception as e:
        print("Greška pri ažuriranju allowcomms:", e)
        return jsonify(message="Došlo je do greške pri ažuriranju allowcomms.")
    finally:
        mycursor.close()
@app.put("/api/posts/addcomment/<postId>")
def add_comment(postId):
    try:
        users=get_users_data();
        posts=get_posts_data();
        for post in posts:
            if post.id==postId:
                p=post
        mycursor = myconn.cursor()
        print(postId)
        # Pretpostavljamo da vrednost za "newComment" dolazi kao JSON podaci u zahtevu
        data = request.get_json()
        new_comment = data.get('newComment')
        print(new_comment)
        update_query = "UPDATE posts SET allcomms = JSON_ARRAY_APPEND(allcomms, '$', %s), comments = comments + 1 WHERE id = %s"
        if(new_comment is None):
            return jsonify(message="prazan")
        if(app.config["logged_user"] is None):
            return jsonify(message="log")
        mycursor.execute(update_query, (new_comment, postId))
        for user in users:
            send_post_comm_email(user.email, p)
        myconn.commit()
        return jsonify(message="success")
    except Exception as e:
        print("Greška pri dodavanju komentara:", e)
        return jsonify(message="Došlo je do greške pri dodavanju komentara.")
    finally:
        mycursor.close()
@app.put("/api/posts/join/<postid>")
def joinTheme(postid):
    joined=json.loads(get_joined_values(postid))
    print(joined)
    posts=get_posts_data();
    
    user=app.config["logged_user"]
    mycursor = myconn.cursor()
    if(app.config["logged_user"] is None):
        return jsonify(message="log")
    user_id=app.config["logged_user"]["id"]
    print(user_id)
    if user_id in joined:
        return jsonify(message="joined")
    
    update_query="UPDATE posts set joined=JSON_ARRAY_APPEND(joined, '$', %s) where id=%s"
    mycursor.execute(update_query, (user_id, postid))
    myconn.commit()
    return jsonify(message="success");

def send_post_email(recipient_email, post):
    # Kreirajte email poruku
    subject = f"Novi post: {post.title}"
    body = f"Novi post je kreiran:\n\nNaslov: {post.title}\nSadržaj: {post.content}\n\nPogledajte post i lajkujte ga na {request.host_url}"

    # Slanje email poruke
    message = Message(subject=subject, body=body, recipients=[recipient_email])
    mail.send(message)
def send_post_comm_email(recipient_email, post):
    # Kreirajte email poruku
    subject = f"post: {post.title}"
    body = f"Novi komentar je kreiran:\n\nNaslov: {post.title}\nSadržaj: {post.content}\n\nPogledajte post {request.host_url}"

    # Slanje email poruke
    message = Message(subject=subject, body=body, recipients=[recipient_email])
    mail.send(message)
def get_joined_values(postid):
    mycursor = myconn.cursor()
    select_query = "SELECT joined FROM posts WHERE id = %s"
    mycursor.execute(select_query, (postid,))
    result = mycursor.fetchone()
    
    if result:
        joined_values = result[0]
        
        return (joined_values)
    else:
        return jsonify(message="Post not found")


if __name__=="__main__":
    app.run(debug=True)
