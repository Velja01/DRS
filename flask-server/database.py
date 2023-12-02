import mysql.connector

# Postavke za povezivanje s bazom podataka
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password123',
    'database': 'RedditBase',
}

# Povezivanje s bazom podataka
connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()

# Kreiranje tabele
create_table_query = """
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ime VARCHAR(255) NOT NULL,
    prezime VARCHAR(255) NOT NULL,
    adresa VARCHAR(255) NOT NULL,
    grad VARCHAR(255) NOT NULL,
    drzava VARCHAR(255) NOT NULL,
    broj_telefona VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    lozinka VARCHAR(255) NOT NULL
)
"""
cursor.execute(create_table_query)
connection.commit()

# Dodavanje korisnika
insert_user_query = "INSERT INTO Users (ime, prezime, adresa, grad, drzava, broj_telefona, email, lozinka) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
user_data = [
    ("Pera", "Peric", "Bulevar Sslobodjenja 23", "Novi Sad", "Srbija", "0601234567", "pera.peric@gmail.com", "password1"),
    ("Mitar", "Miric", "Bulevar Evrope 45", "Novi Sad", "Srbija", "0614987568", "mitar.miric@gmail.com", "password2"),
    ("Marko", "Markic", "Gunduliceva 56", "Novi Sad", "Srbija", "0645798321", "marko.markic@gmail.com", "password3"),
]

cursor.executemany(insert_user_query, user_data)
connection.commit()

# Zatvaranje veze s bazom podataka
cursor.close()
connection.close()
