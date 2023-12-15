# User.py

class User:
    def __init__(self, id, ime, prezime, adresa, grad, drzava, broj_telefona, email, lozinka):
        self.id = id
        self.ime = ime
        self.prezime = prezime
        self.adresa = adresa
        self.grad = grad
        self.drzava = drzava
        self.broj_telefona = broj_telefona
        self.email = email
        self.lozinka = lozinka
        
    def to_tuple(self):
        # Pretvaranje atributa klase u tuple za unos u bazu
        return (
            
            self.ime,
            self.prezime,
            self.adresa,
            self.grad,
            self.drzava,
            self.broj_telefona,
            self.email,
            self.lozinka
        )
    