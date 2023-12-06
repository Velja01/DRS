// LoginPage.tsx
import { useState, useEffect } from 'react';
import './LogInPage.css';

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


export default function LogInPage() {
  const [data, setData] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]=useState('');

  useEffect(() => {
    fetch("http://localhost:5000/api/login")
      .then(res => res.json())
      .then((responseData:{users:User[]}) => {
        setData(responseData.users);
        console.log(responseData);
      })
      .catch(error => {
        console.error('Greška pri dohvatanju podataka:', error);
      });
  }, []);
 // ...

const handleLogin = () => {
  // Provera da li postoji korisnik sa datim username i password
  const userExists = data.some(user => user.email === username && user.lozinka === password);

  if (userExists) {
    console.log('Korisnik pronađen!');
    setMessage('');
    
  } else {
    console.log('Korisnik nije pronađen.');
    setMessage('korisnik nije pronadjen');
  }
};

// ...

  return (
    <div>
      <p>Username: </p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <p>Password: </p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Log In</button>
      <div>{message}</div>
      
    </div>
  );
}
