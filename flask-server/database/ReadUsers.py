from classes.user import User  # Assuming you have a User class in a file named user.py
import mysql.connector

def get_users_data():
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password123',
        'database': 'RedditBase',  # Replace with your actual database name
    }

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    select_users_query = "SELECT id, ime, prezime, adresa, grad, drzava, broj_telefona, email, lozinka FROM Users"
    cursor.execute(select_users_query)

    users_data = []
    for (user_id, ime, prezime, adresa, grad, drzava, broj_telefona, email, lozinka) in cursor.fetchall():
        user = User(user_id, ime, prezime, adresa, grad, drzava, broj_telefona, email, lozinka)
        users_data.append(user)

    cursor.close()
    connection.close()

    return users_data
