from flask import Flask, g, request, jsonify, render_template
from flask_cors import CORS
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
        "user_id":post.user_id
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
    print("nesto zeza u requstuuu")
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
    )
    print(p.title)
    insert_post(p);
    return jsonify(messag="Post je uspesno kriran i upisan u bazu")
@app.route("/api/posts/vote", methods=['POST'])
def votes():
    print("ne radi")
    request_data=request.get_json();
    postId=request_data.get('id')
    postVote=request_data.get('likeDislike')
    print(postId)
    print(postVote)
    
    
    changePostInfo(postId, postVote)
    return jsonify(message="izmenjeno")
if __name__=="__main__":
    app.run(debug=True)
