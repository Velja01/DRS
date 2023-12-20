import React, { useState, useEffect, useCallback, useRef } from "react";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import { FaShare } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import './Posts.css';

interface Post {
  id:number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  comments: number;
}

interface PostsProps {
  sortBy: string;
}

export default function Posts({ sortBy }: PostsProps) {
  const [data, setData] = useState<Post[]>([]);
  const prevSortBy = useRef<string>("downvotes");

  const sortPosts = useCallback((posts: Post[], sortBy: string) => {
    let sortedData = [...posts];
    if (sortBy === 'leastcomments') {
      sortedData.sort((a, b) => a.comments - b.comments);
    } else if (sortBy === 'upvotes') {
      sortedData.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'downvotes') {
      sortedData.sort((a, b) => b.downvotes - a.downvotes);
    } else if (sortBy === 'mostcomments') {
      sortedData.sort((a, b) => b.comments - a.comments);
    }
    return sortedData;
  }, []);
  const handleClick = async (postId: number, likeDislike: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:postId,
          likeDislike: likeDislike,
        }),
      });
      const rezultat=await response.json();
      if (rezultat.ok) {
        // Uspesan odgovor od servera, mozete azurirati podatke ili obaviti dodatne operacije
        console.log(`Uspesan ${likeDislike} za post sa ID ${postId}`);
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
    if (sortBy !== prevSortBy.current) {
      fetchData();
    }
  }, [sortBy, sortPosts]);

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
                <span className="spacer"></span>
              </div>
              <div className="post-body">
                <span className="title">{post.title}</span>
                <span className="description">{post.content}</span>
              </div>
              <div className="post-footer">
                <div className="comments footer-action">
                  <LiaCommentSolid className="comment-icon" />
                  <span>{post.comments || 0}</span>
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
