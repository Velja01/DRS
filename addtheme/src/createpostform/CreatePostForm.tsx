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
  allowcomms:boolean;
  allcomms:[];
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
  const[posts, setPosts]=useState<Post[]>([]);
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
    useEffect(() => {
      if (currentUser) {
        fetch("http://localhost:5000/api/posts")
          .then(res => res.json())
          .then((data: { posts: Post[] }) => {
            const userPosts = data.posts.filter((p: Post) => p.user_id === currentUser.id);
            setPosts(userPosts);
            console.log(data);
          })
         .catch(error => {
           console.error('Greška pri dohvatanju podataka:', error);
         });
      }
    }, [currentUser, posts]);
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
    user_id:currentUser ? currentUser.id : 0,
    allowcomms:false,
    allcomms:[]
  });
  const handleDeletePost = async (id:number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deletepost/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setMessage(result.message);
      console.log('Server Response:', result);

      // Ažurirajte posts nakon brisanja
      if (currentUser) {
        fetch("http://localhost:5000/api/posts")
          .then(res => res.json())
          .then((data: { posts: Post[] }) => {
            const userPosts = data.posts.filter((p: Post) => p.user_id === currentUser.id);
            setPosts(userPosts);
            console.log(data);
          })
          .catch(error => {
            console.error('Greška pri dohvatanju podataka:', error);
          });
      }
    } catch (error) {
      console.error('Greška pri brisanju posta:', error);
    }
  };

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
          user_id:currentUser?.id,
          allowcomms:true,
          allcomms:post.allcomms
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
  
  const handleAllowCommsChange = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/updateallowcomms/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allowcomms: !post.allowcomms, // Obrni vrednost allowcomms
        }),
      });
  
      const result = await response.json();
      console.log('Server Response:', result);
  
      // Ažurirajte vrednost u state-u
      setPost({ ...post, allowcomms: !post.allowcomms });
    } catch (error) {
      console.error('Greška pri promeni statusa komentara:', error);
    }
  };
  
  
  return (
    <div className="main-container">
      
      <div>
      
        <h2 className="title">Add Theme</h2>
        <img className='img' src="./assets/images/reddit_logo.jpg" alt=""></img>
        <br/>
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
        <button className="button1" onClick={handleSubmit}>Share post</button>
        <div>{message}</div>
      </div>
      <div>
        <h2 >Your Posts:</h2>
        <ul>
          {posts.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              <p>{p.content}</p>
              <button className="button" onClick={()=>handleDeletePost(p.id)}>Delete post</button>
              <label className="post">
                Allow comments:
                <input
                 type="checkbox"
                 checked={post?.allowcomms || false}
                 onChange={()=>handleAllowCommsChange(p.id)}
                  />
            </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}