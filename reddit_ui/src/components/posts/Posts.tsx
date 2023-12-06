import React, {useState, useEffect} from "react";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import { FaShare } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import './Posts.css';

interface Post {
    title: string;
    content: string;
    author: string;
    created_at: string;
    upvotes: number;
    downvotes: number;
    comments: number;
  }

export default function Posts(){
    const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
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
      
      {(data === null || data.length === 0) ? (
        <p>Loading items...</p>
      ) : (
        <div className="posts-wrapper">
          {data.map((post, index) => (
            <div key={index} className="post">
                <div className="post-sidebar">
                    <BiUpvote className="upvote"/><p>{post.upvotes || 0}</p>
                    <BiDownvote className="downvote"/>
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