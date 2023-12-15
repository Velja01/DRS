import { useEffect, useState } from 'react';
import './UserInfo.css'

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

export default function UserInfo(){
    const [message, setMessage] = useState('');
    const [user, setUser] = useState<User | null>(null);
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
    const handleChangeUser=async()=>{
       try{
        const requestData={
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
        }
        const odgovor = await fetch("http://localhost:5000/api/changeuserinfo", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
          });
          const rezultat = await odgovor.json();
          setMessage(rezultat.message);
        }
            
        catch(error){
          console.error('Greska pri slanju podataka na server: ', error);
        }
    }
    useEffect(() => {
      fetch("http://localhost:5000/api/getuser")
        .then(res => res.json())
        .then((data) => {
          setUser(data.user);
          setUserData(data.user);
          console.log(data);
        })
        .catch(error => {
          console.error('Greška pri dohvatanju podataka:', error);
        });
    }, []);
    return (
      <div>
        {(user === null) ? (
          <p>Loading items...</p>
        ) : (
        <div className="form-container">
        
          
          <label className="form-label">Ime:
          <label
            className="form-input"
          >{user.ime}</label></label>
          <label className='form-label'>Novo ime</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, ime: e.target.value })}
          />
    
          <label className="form-label">Prezime:
          <label
            className="form-input"
          >{user.prezime}</label></label>
          <label className='form-label'>Novo prezime</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, prezime: e.target.value })}
          />

          <label className="form-label">Adresa:
          <label
            className="form-input"
          >{user.adresa}</label></label>
          <label className='form-label'>Nova adresa</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, adresa: e.target.value })}
          />
    
          <label className="form-label">Grad:
          <label
            className="form-input"
          >{user.grad}</label></label>
          <label className='form-label'>Novi grad</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, grad: e.target.value })}
          />
    
          <label className="form-label">Drzava:
          <label
            className="form-input"
          >{user.drzava}</label></label>
          <label className='form-label'>Nova drzava</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, drzava: e.target.value })}
          />
    
          <label className="form-label">Broj telefona:
          <label
            className="form-input"
          >{user.broj_telefona}</label></label>
          <label className='form-label'>Novi Broj telefona</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, broj_telefona: e.target.value })}
          />
    
          <label className="form-label">Email:
          <label
            className="form-input"
          >{user.email}</label></label>
          <label className='form-label'>Novi email</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <label className="form-label">Lozinka:
          <label
            className="form-input"
          >{user.lozinka}</label></label>
          <label className='form-label'>Nova lozinka</label>
          <input
            type='password'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, lozinka: e.target.value })}
          />
    
          <button className="form-button" onClick={handleChangeUser}>Sign Up</button>
          <div className="form-message">{message}</div><br/>
          <div><a href="/"><button>Home</button></a></div>
          </div>
        
        
        )}
      </div>
      );
}