import React, { ChangeEvent, useEffect, useState } from "react";
import "./Searchbar.css"
import { IoIosSearch } from "react-icons/io";

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

export default function Searchbar() {
    const [posts, setPosts] = useState<Post[]>();
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Post[]>();
  
    const handleSearch = () => {
      // Filtriramo postove koji sadrže naziv pretrage
      const results = posts?.filter((post) =>
        post.title.toLowerCase().includes(searchValue.toLowerCase())
      );
  
      // Ažuriramo stanje sa rezultatima pretrage
      setSearchResults(results);
    };
  
    useEffect(() => {
      fetch("http://localhost:5000/api/posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
          console.log(data);
        })
        .catch((error) => {
          console.error("Greška pri dohvatanju podataka:", error);
        });
    }, []);
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
      };
    
  
    return (
      <div className="searchbar">
        <label htmlFor="searchbar">
          <IoIosSearch size={20} className="icon-search"/>
        </label>
        <input
          id="searchbar"
          placeholder="Search"
          value={searchValue}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
  
        {searchResults && (
          <div>
            <h2>Search Results:</h2>
            <ul>
              {searchResults.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  