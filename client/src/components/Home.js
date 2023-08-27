import { Link } from "react-router-dom";
import { useContext,useState,useRef } from "react";
import AuthContext from "../context/AuthProvider";
import {axiosPrivate} from "../api/axios";


const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();

    const logout = async (e) => {
        e.preventDefault();
        try {
            await await axiosPrivate.get('/logout');
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
            <br />
            <Link to="/editor">Go to the Editor page</Link>
            <br />
            <Link to="/admin">Go to the Admin page</Link>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home
