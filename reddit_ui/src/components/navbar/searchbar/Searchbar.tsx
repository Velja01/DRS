import React from "react";
import "./Searchbar.css"
import { IoIosSearch } from "react-icons/io";
export default function Searchbar(){
    return <div className="searchbar">
        <label htmlFor="searchbar">
            <IoIosSearch size={20}/>
        </label>
        <input id="searchbar" placeholder="Search"/>
    </div>
}