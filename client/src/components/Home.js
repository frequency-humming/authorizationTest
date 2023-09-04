import { Link } from "react-router-dom";
import { useContext,useState,useRef } from "react";
import AuthContext from "../context/AuthProvider";
import {axiosPrivate} from "../api/axios";


const Home = () => {
    const { auth,setAuth } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    console.log(auth.user);
    const logout = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.post('/logout',{ user: auth.user });
            setAuth({});
        }catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                console.log(err);
                setErrMsg('Failed Request');
            }
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Home</h1>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
            <Link to="/users">Go to the Data page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home
