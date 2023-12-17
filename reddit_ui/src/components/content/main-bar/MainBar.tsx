import React, { useState } from "react";
import './MainBar.css'
import Posts from "../../posts/Posts";

export default function MainBar() {
  const [sortBy, setSortBy] = useState<string>("upvotes");

  const handleSortBy = (sortOption: string) => {
    setSortBy(sortOption);
  };

  return (
    <div className="main-bar">
      <div className="filter-container">
        <div>
          <span>Sort by:</span>
        </div>
        <div
          className="filter-element-secondary hoverable"
          onClick={() => handleSortBy("upvotes")}
        >
          <span>Upvotes</span>
        </div>
        <div
          className="filter-element-secondary hoverable"
          onClick={() => handleSortBy("downvotes")}
        >
          <span>Downvotes</span>
        </div>
        <div
          className="filter-element-secondary hoverable"
          onClick={() => handleSortBy("mostcomments")}
        >
          <span>Most Comments</span>
        </div>
        <div
          className="filter-element-secondary hoverable"
          onClick={() => handleSortBy("leastcomments")}
        >
          <span>Least Comments</span>
        </div>
        <div className="spacer"></div>
      </div>
      <Posts sortBy={sortBy} />
    </div>
  );
}
