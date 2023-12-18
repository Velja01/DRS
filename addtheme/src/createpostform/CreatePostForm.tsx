import { useEffect, useState } from "react";
import './CreatePostForm.css';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  user_id:number;
}

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



export default function CreatePostForm() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/getuser")
      .then(res => res.json())
      .then((data) => {
        setCurrentUser(data.user);
        console.log(data);
      })
      .catch(error => {
        console.error('Greška pri dohvatanju podataka:', error);
      });
  }, []);

  const [message, setMessage] = useState('');
  const [post, setPost] = useState<Post>({
    id: 0,
    title: "",
    content: "",
    author: currentUser ? currentUser.ime : "",
    created_at: "",
    upvotes: 0,
    downvotes: 0,
    comments: 0,
    user_id:currentUser ? currentUser.id : 0
  });

  const handleSubmit = async () => {
    try {
      
      const requestData = {
        Post: {
          id: post.id,
          title: post.title,
          content: post.content,
          author: currentUser?.ime,
          created_at: new Date().toISOString().replace('T', ' ').replace('Z', ''),
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          comments: post.comments,
          user_id:currentUser?.id
        },
      };

      console.log('Request Data:', requestData);

      const response = await fetch("http://localhost:5000/api/sharepost", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      setMessage(result.message);
      console.log('Server Response:', result);
    } catch (error) {
      console.error('Greška pri slanju podataka na server:', error);
    }
  };

  return (
    <div className="main-container">
      <form >
        <label className="post">
          Naslov:
          <input
            className="post"
            type="text"
            name="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </label>
        <br />
        <label className="post">
          Sadržaj:
          <textarea
            className="post"
            name="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
        </label>
        <br />
        <button onClick={handleSubmit}>Share post</button>
        <div>{message}</div>
      </form>
    </div>
  );
}
