import json
from flask import Flask, g, request, jsonify, render_template
from flask_cors import CORS
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

myconn = mysql.connector.connect(host = "localhost", user = "root",passwd = "password123", database = "redditBase")  

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
    
    #insert_user(u);

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
 
    post_id=2;
    sql = f"SELECT allcomms FROM Posts WHERE id = {post_id}"
    mycursor.execute(sql)
    
    result = mycursor.fetchone()
    allcomms_json = result[0]

    # Pretvorite JSON string u Python listu (ili objekat, zavisno od formata)
    allcomms_list = json.loads(allcomms_json)
    print(allcomms_list)
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
    request_post.get('Post', {}).get('allowcomms'),
    request_post.get('Post', {}).get('allcomms')
    )
    print(p.allcomms)
    insert_post(p);
    return jsonify(message="Post je uspesno kriran i upisan u bazu")
@app.route("/api/posts/vote", methods=['POST'])
def votes():
    
    request_data=request.get_json();
    postId=request_data.get('id')
    postVote=request_data.get('likeDislike')
    if(app.config['logged_user']) is not None:
        changePostInfo(postId, postVote)
        return jsonify(message="radi")
    if app.config['logged_user'] is None:
        return jsonify(message="ne_radi")
@app.delete("/api/deletepost/<postId>")
def deletePost(postId):
    try:

        mycursor = myconn.cursor()
        delete_query = "DELETE FROM posts WHERE id = %s"
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
        
        mycursor = myconn.cursor()
        print(postId)
        # Pretpostavljamo da vrednost za "newComment" dolazi kao JSON podaci u zahtevu
        data = request.get_json()
        new_comment = data.get('newComment')
        print(new_comment)
        update_query = "UPDATE posts SET allcomms = JSON_ARRAY_APPEND(allcomms, '$', %s) WHERE id = %s"
        if(app.config["logged_user"] is None):
            return jsonify(message="log")
        mycursor.execute(update_query, (new_comment, postId))

        myconn.commit()

        return jsonify(message="success")
    except Exception as e:
        print("Greška pri dodavanju komentara:", e)
        return jsonify(message="Došlo je do greške pri dodavanju komentara.")
    finally:
        mycursor.close()

if __name__=="__main__":
    app.run(debug=True)
