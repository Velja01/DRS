import React from "react";
import "./Actions.css";
import Button from "../../button/Button";
import {CgProfile} from "react-icons/cg";





export default function Actions(){
    
    
    const onclickLogIn=()=>{
         
    }
    const onclickSignUp=()=>{

    }
    const onclickProfile=()=>{

    }
    return <div className="actions">
        <a href="/LogIn"><Button label="LOG IN" onClick={onclickLogIn}/></a>
        <a href="/SignUp"><Button label="SIGN UP" onClick={onclickSignUp}/></a>
        <div className="profile hoverable">
            
            <a href="/UserInfo"><CgProfile className="hoverable" size={35} onClick={onclickProfile}/></a>
            
        </div>
    </div>
}