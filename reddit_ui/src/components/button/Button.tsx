import React from "react";
import "./Button.css"

interface Props{
    primary?:boolean;
    secondary?:boolean;
    label:string;
    tertiary?:boolean;
    onClick:()=>void;
}

export default function Button({primary, secondary, label, tertiary, onClick}: Props){
    if(primary){
        return <div className="button primary" onClick={onClick}>{label} </div>
    }else{
        return <div className="button secondary" onClick={onClick}>{label}</div>
    }
    
}