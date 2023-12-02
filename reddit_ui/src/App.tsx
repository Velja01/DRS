import React, {useState, useEffect} from 'react';
 
import './App.css';
import Landing from './components/landing/Landing';

interface Post {
  title: string;
  content: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  comments: number;
}
function App() {
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/views")
      .then(res => res.json())
      .then((data: { posts: Post[] }) => {
        setData(data.posts);
        console.log(data);
      })
      .catch(error => {
        console.error('Greška pri dohvatanju podataka:', error);
      });
  }, []);

  return (

    <div style={{ textAlign: 'center' }}>
      <Landing/>
      {(data === null || data.length === 0) ? (
        <p>Loading items...</p>
      ) : (
        <div>
          {data.map((post, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Autor: {post.author || 'Nepoznat'}</p>
              <p>Kreirano: {post.created_at || 'Nepoznato'}</p>
              <p>Upvotovi: {post.upvotes || 0}</p>
              <p>Downvotovi: {post.downvotes || 0}</p>
              <p>Komentari: {post.comments || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default App;
