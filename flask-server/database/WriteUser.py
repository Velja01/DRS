from classes.user import User
import mysql.connector

def insert_user(user):
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',  # Zamijenite sa stvarnim imenom vaše baze podataka
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # SQL upit za unos korisnika (preskače se polje 'id' jer je auto increment)
    insert_user_query = "INSERT INTO users (ime, prezime, adresa, grad, drzava, broj_telefona, email, lozinka) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    
    # Dohvati tuple vrednosti iz objekta korisnika
    user_data = user.to_tuple()

    # Izvrši upit za unos korisnika
    cursor.execute(insert_user_query, user_data)

    # Potvrdi promene u bazi
    connection.commit()

    # Zatvori kursor i konekciju
    cursor.close()
    connection.close()
def update_user(user):
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',  # Zamijenite sa stvarnim imenom vaše baze podataka
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # SQL upit za izmenu korisnika
    update_user_query = """
    UPDATE users
    SET ime = %s, prezime = %s, adresa = %s, grad = %s, drzava = %s,
        broj_telefona = %s, email = %s, lozinka = %s
    WHERE id = %s
    """

    # Dohvati tuple vrednosti iz objekta korisnika
    user_data = (
        user.ime,
        user.prezime,
        user.adresa,
        user.grad,
        user.drzava,
        user.broj_telefona,
        user.email,
        user.lozinka,
        user.id,  # Dodajemo i ID kao poslednji element
    )
    # Izvrši upit za izmenu korisnika
    cursor.execute(update_user_query, user_data)

    # Potvrdi promene u bazi
    connection.commit()

    # Zatvori kursor i konekciju
    cursor.close()
    connection.close()
