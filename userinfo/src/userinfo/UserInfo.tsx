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
      <div className='okvir'>
        <img className='img' src="./assets/images/reddit_logo.jpg" alt=""></img>
      <h2>USER INFO</h2>
      <hr></hr>
      
      <div className='okvir2'>
        {(user === null) ? (
          <p>Loading items...</p>
        ) : (

        <div className="margin">
          
          <div className='row'>
          <label className="form-label-bold">Ime:</label>
          <label className="form-label">{user.ime}</label>
          </div>

          <div className='row'>
          <label className="form-label-bold">Prezime:</label>
          <label className="form-label">{user.prezime}</label>
          </div>

          <div className='row'>  
          <label className="form-label-bold">Adresa:</label>
          <label className="form-label">{user.adresa}</label>
          </div>

          <div className='row'>
          <label className="form-label-bold">Grad:</label>
          <label className="form-label">{user.grad}</label>
          </div>

          <div className='row'>
          <label className="form-label-bold">Drzava:</label>
          <label className="form-label">{user.drzava}</label>
          </div>

          <div className='row'>
          <label className="form-label-bold">Broj telefona:</label>
          <label className="form-label">{user.broj_telefona}</label>
          </div>

          <div className='row'>
          <label className="form-label-bold">Email:</label>
          <label className="form-label">{user.email}</label>
          </div>

          <div className='row'>
          <label className="form-label-bold">Lozinka:</label>
          <label className="form-label">{user.lozinka}</label>
          </div>

          </div>
          
        
        )}
      
      <div className='margin'>
        <div className='row'>
        <label className='form-label-bold'>Novo ime</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, ime: e.target.value })}
          />
          </div>
          <div className='row'>
            <label className='form-label-bold'>Novo prezime</label>
            <input
              type='text'
              className='form-input'
              onChange={(e) => setUserData({ ...userData, prezime: e.target.value })}
          />
          </div>
          <div className='row'>
          <label className='form-label-bold'>Nova adresa</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, adresa: e.target.value })}
          />
          </div>
          <div className='row'>
          <label className='form-label-bold'>Novi grad</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, grad: e.target.value })}
          />
          </div>
          <div className='row'>
          <label className='form-label-bold'>Nova drzava</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, drzava: e.target.value })}
          />
          </div>
          <div className='row'>
          <label className='form-label-bold'>Novi Broj telefona</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, broj_telefona: e.target.value })}
          />
          </div>
          <div className='row'>
            <label className='form-label-bold'>Novi email</label>
          <input
            type='text'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          </div>
          <div className='row'>
          <label className='form-label-bold'>Nova lozinka</label>
          <input
            type='password'
            className='form-input'
            onChange={(e) => setUserData({ ...userData, lozinka: e.target.value })}
          />
          </div>

          <button className="form-button1" onClick={handleChangeUser}>Change Users info</button>

          <div className="form-message">{message}</div><br/>

      </div>
      </div>
      <div><a href="/"><button className='form-button'>Home</button></a></div>
      </div>
      );
}