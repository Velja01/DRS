import React from "react";

import './MainBar.css'
import {FaHotjar} from "react-icons/fa"
import {MdNewReleases} from "react-icons/md"
import {FaChevronDown} from "react-icons/fa"
import { FaArrowTrendUp } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { MdMenu } from "react-icons/md";
import Posts from "../../posts/Posts";

export default function MainBar(){
    return( 
    <div className="main-bar">
        
        <div className="filter-container">
            <div className="filter-element hoverable">
                <FaHotjar/>
                <span>Hot</span>
            </div>
            <div className="filter-element hoverable">
                <span>Everywhere</span>
                <FaChevronDown/>
            </div>
            <div className="filter-element-secondary hoverable">
                <MdNewReleases size={20}/>
                <span>New</span>
            </div>
            <div className="filter-element-secondary hoverable">
                <FaArrowTrendUp/>
                <span>Top</span>
            </div>
            <div>
                <BsThreeDots className="filter-element-tertiary hoverable"/> 
            </div>
            <div className="spacer"></div>
            <div className="filter-element-menu hoverable">
                <MdMenu/>
                <FaChevronDown/>
            </div>
        </div>
        <Posts/>

    </div>
    )
}