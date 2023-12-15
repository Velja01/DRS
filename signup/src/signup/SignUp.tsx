import { useState } from "react";
import './SignUp.css'
interface User {
    id: number;
    ime: string;
    prezime: string;
    adresa: string;
    grad: string;
    drzava: string;
    broj_telefona: string;
    email: string;
    lozinka: string;
}

export default function SignUp() {
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState<User>({
        id: 0,
        ime: '',
        prezime: '',
        adresa: '',
        grad: '',
        drzava: '',
        broj_telefona: '',
        email: '',
        lozinka: '',
    });

    const handleSignup = async () => {
        try {
            const requestData = {
                userData:{
                    id: userData.id,
                    ime: userData.ime,
                    prezime: userData.prezime,
                    adresa: userData.adresa,
                    grad: userData.grad,
                    drzava: userData.drzava,
                    broj_telefona: userData.broj_telefona,
                    email: userData.email,
                    lozinka: userData.lozinka,
                }
            };
            
            const odgovor = await fetch("http://localhost:5000/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const rezultat = await odgovor.json();
            setMessage(rezultat.message);

        } catch (error) {
            console.error('Greska pri slanju podataka na server: ', error);
        }
    };

    return (
        <div className="form-container">
          <label className="form-label">Ime:</label>
          <input
            type="text"
            className="form-input"
            value={userData.ime}
            onChange={(e) => setUserData({ ...userData, ime: e.target.value })}
          />
    
          <label className="form-label">Prezime:</label>
          <input
            type="text"
            className="form-input"
            value={userData.prezime}
            onChange={(e) => setUserData({ ...userData, prezime: e.target.value })}
          />
    
          <label className="form-label">Adresa:</label>
          <input
            type="text"
            className="form-input"
            value={userData.adresa}
            onChange={(e) => setUserData({ ...userData, adresa: e.target.value })}
          />
    
          <label className="form-label">Grad:</label>
          <input
            type="text"
            className="form-input"
            value={userData.grad}
            onChange={(e) => setUserData({ ...userData, grad: e.target.value })}
          />
    
          <label className="form-label">Drzava:</label>
          <input
            type="text"
            className="form-input"
            value={userData.drzava}
            onChange={(e) => setUserData({ ...userData, drzava: e.target.value })}
          />
    
          <label className="form-label">Broj telefona:</label>
          <input
            type="text"
            className="form-input"
            value={userData.broj_telefona}
            onChange={(e) => setUserData({ ...userData, broj_telefona: e.target.value })}
          />
    
          <label className="form-label">Email:</label>
          <input
            type="text"
            className="form-input"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
    
          <label className="form-label">Lozinka:</label>
          <input
            type="password"
            className="form-input"
            value={userData.lozinka}
            onChange={(e) => setUserData({ ...userData, lozinka: e.target.value })}
          />
    
          <button className="form-button" onClick={handleSignup}>Sign Up</button>
          <div className="form-message">{message}</div><br/>
          <div><a href="/"><button>Home</button></a></div>
        </div>
      );
}
