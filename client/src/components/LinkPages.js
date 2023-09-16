import { useState,useEffect } from "react";
import { Link } from "react-router-dom"

const LinkPages = () => {
    const [data, setData] = useState(false);
    useEffect(()=>{

        const links = 
            <div>
                <h1>Links</h1>
                <br />
                <Link to="/login">Login</Link>
                <br />
                <Link to="/register">Register</Link>
                <br />
                <h2>Private</h2>
                <Link to="/">Home</Link>
            </div>
            setData(links);
    },[])

    return data;
    
}

export default LinkPages;
