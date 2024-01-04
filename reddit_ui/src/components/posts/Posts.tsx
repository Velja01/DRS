import React, { useState, useEffect, useCallback, useRef } from "react";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import { FaShare } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import './Posts.css';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  allowcomms: boolean;
  allcomms: string[];
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
interface PostsProps {
  sortBy: string;
}

export default function Posts({ sortBy }: PostsProps) {
  const [data, setData] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [userData, setUserData] = useState<User | null>(null);

  const prevSortBy = useRef<string>("downvotes");
  const [change, setChange] = useState<number>(0);
  const sortPosts = useCallback((posts: Post[], sortBy: string) => {
    let sortedData = [...posts];
    if (sortBy === 'leastcomments') {
      sortedData.sort((a, b) => a.comments - b.comments);
    } else if (sortBy === 'upvotes') {
      sortedData.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'downvotes') {
      sortedData.sort((a, b) => a.upvotes - b.upvotes);
    } else if (sortBy === 'mostcomments') {
      sortedData.sort((a, b) => b.comments - a.comments);
    }
    return sortedData;
  }, []);

  const handleJoin = (postId: number) => {
    const selectedPost = data.find(post => post.id === postId);
    setSelectedPost(selectedPost || null);
  };

  const handleAddComment = async (postId: number, newComment: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/addcomment/${postId}`, {
        method: 'PUT', // Promenite metod zahteva na PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newComment: newComment,
        }),
      });
      const result = await response.json();
      if (result.message === "success") {
        // Ažurirajte podatke o komentarima
        const updatedData = data.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              allcomms: [...post.allcomms, newComment],
            };
          }
          return post;
        });
        setData(updatedData);
        // Poništite trenutno odabrani post
        setSelectedPost(null);
      }
      if(result.message==="log"){
        console.log("Morate se ulogovati da bi ste komentarisali postove!")
      }
      else {
        console.error('Greška prilikom dodavanja komentara:', result.message);
      }
    } catch (error) {
      console.error('Greška prilikom slanja zahteva za dodavanje komentara:', error);
    }
  };
  const JoinTheme = async (postId: number) => {
    console.log("upada");
    try {
      const responseUser = await fetch("http://localhost:5000/api/getuser");
      const dataUser = await responseUser.json();
      console.log("upada");
      setUserData(dataUser.user);
  
      if (userData != null) {
        const responseJoin = await fetch(`http://localhost:5000/api/posts/join/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await responseJoin.json();
        if (result === "success") {
          console.log("uspesno ste se joinovali");
        } else {
          console.log("greska prilikom joinovanja");
        }
      } else {
        console.log("Morate se ulogovati");
      }
    } catch (error) {
      console.error('Greška prilikom izvršavanja JoinTheme:', error);
    }
  };
  

  const handleClick = async (postId: number, likeDislike: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postId,
          likeDislike: likeDislike,
        }),
      });
      const rezultat = await response.json();
      if (rezultat.message === "radi") {
        // Uspesan odgovor od servera, azuriraj lokalno stanje
        setChange((prevChange) => prevChange + 1);
      } else {
        // Greska od servera
        console.error(`Greska prilikom ${likeDislike} za post sa ID ${postId}`);
      }
    } catch (error) {
      // Greska prilikom slanja zahteva
      console.error(`Greska prilikom slanja zahteva za ${likeDislike} za post sa ID ${postId}`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        const data: { posts: Post[] } = await response.json();
        const sortedData = sortPosts(data.posts, sortBy);
        setData(sortedData);
        prevSortBy.current = sortBy;
      } catch (error) {
        console.error('Greška pri dohvatanju podataka:', error);
      }
    };

    // Ako je sortBy različito od prethodnog sortBy, onda pozovi fetch
    if (sortBy !== prevSortBy.current || change) {
      fetchData();
    }
  }, [sortBy, sortPosts, change]);

  return (
    <div style={{ textAlign: 'center' }}>
      {(data === null || data.length === 0) ? (
        <p>Loading items...</p>
      ) : (
        <div className="posts-wrapper">
          {data.map((post, index) => (
            <div key={index} className="post">
              <div className="post-sidebar">
                <BiUpvote onClick={() => handleClick(post.id, 'like')} className="upvote" /><p>{post.upvotes || 0}</p>
                <BiDownvote onClick={() => handleClick(post.id, 'dislike')} className="downvote" />
              </div>
              <div className="post-title">
                <span className="post-user">Posted by</span>
                <span className="post-user underline">u/{post.author || 'Nepoznat'}</span>
                <span className="created">Created: {post.created_at || 'Nepoznato'}</span>
                <span><button onClick={()=>JoinTheme(post.id)}>Join</button></span>
                <span className="spacer"></span>
              </div>
              <div className="post-body">
                <span className="title">{post.title}</span>
                <span className="description">{post.content}</span>
              </div>
              <div className="post-footer">
                <div className="comments footer-action">
                  <LiaCommentSolid className="comment-icon" />
                  <span onClick={() => handleJoin(post.id)}>View Comments ({post.comments || 0})</span>
                  {selectedPost && selectedPost.id === post.id && (
                    <div>
                      <h3>Comments</h3>
                      <ul>
                        {post.allcomms.map((comment, index) => (
                          <li key={index}>{comment}</li>
                        ))}
                      </ul>
                      <form
                          onSubmit={(e) => {
                          e.preventDefault();
                          // Cast EventTarget to HTMLFormElement
                          const form = e.target as HTMLFormElement;
                          // Access the 'comment' property
                          const newComment = form.comment.value;
                          // Add your logic to handle the new comment
                          handleAddComment(post.id, newComment);
                          }}
                      >
                        <textarea name="comment" placeholder="Add a comment"></textarea>
                        <button type="submit">Submit</button>
                      </form>

                    </div>
                  )}
                </div>
                <div className="share footer-action">
                  <FaShare />
                  <span>Share</span>
                </div>
                <div className="save footer-action">
                  <CiBookmark />
                  <span>Save</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
