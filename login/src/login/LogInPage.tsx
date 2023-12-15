// LoginPage.tsx
import { useState } from 'react';
import './LogInPage.css';




export default function LogInPage() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]=useState('');

  

 const handleLogin = async () => {
  try {
    // Napravite objekat sa podacima koje želite poslati na server
    const requestData = {
      username: username,
      password: password,
    };

    const odgovor = await fetch("http://localhost:5000/api/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const rezultat = await odgovor.json();
    setMessage(rezultat.message);
    console.log(rezultat);
  } catch (error) {
    console.error('Greška pri slanju podataka na server:', error);
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
      <div>{message}</div><br/>
      <div><a href='/'><button>Back to Main Page</button></a></div>
      
    </div>
  );
}
