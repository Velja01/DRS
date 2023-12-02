import React from "react";
import "./Actions.css"
import Button from "../../button/Button";
import {CgProfile} from "react-icons/cg"

export default function Actions(){
    const onclickLogIn=()=>{

    }
    const onclickSignUp=()=>{

    }
    const onclickProfile=()=>{

    }
    return <div className="actions">
        <Button label="LOG IN" onClick={onclickLogIn}/>
        <Button primary label="SIGN UP" onClick={onclickSignUp}/>
        <div className="profile hoverable">
            <CgProfile className="hoverable" size={35} onClick={onclickProfile}/>

        </div>
    </div>
}