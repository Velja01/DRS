import React from "react";

import './Community.css';
import Button from "../../button/Button";
import communties from "../../../data/communities/communities.json";
import { FaArrowUp } from "react-icons/fa";

export default function Community(){
    const handleClick = () => {
        // Prazna funkcija - ne radi ništa
      };
    return (
        <div className="community-section">
          <div className="title">
            <span className="hoverable">Today's Top Growing Communities</span>
          </div>
          <div className="communities-wrapper">
            {communties.map((community, index) => (
              <div className="community hoverable">
                <span>{index + 1}</span>
                <FaArrowUp />
                <img alt="Communities" src={community.image_src} />
                <span className="name">r/{community.name}</span>
              </div>
            ))}
          </div>
          
          <div className="action-buttons">
            <Button primary label="VIEW ALL" onClick={handleClick}/>
            <div className="secondary-buttons">
              <Button tertiary onClick={handleClick} label="Sports" />
              <Button tertiary onClick={handleClick} label="News" />
              <Button tertiary onClick={handleClick} label="Gaming" />
              <Button tertiary onClick={handleClick} label="Aww" />
            </div>
          </div>
        </div>
      );
}