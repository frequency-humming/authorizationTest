import { useContext,useState,useRef } from "react";
import AuthContext from "../context/AuthProvider";
import {axiosPrivate} from "../api/axios";
import LinkPages from "./LinkPages";
import Users from './Users';


const Home = () => {
    const { auth,setAuth } = useContext(AuthContext);
    const [errMsg, setErrMsg] = useState('');
    const [contentComponent, setContentComponent] = useState(null);
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
    const links = () => {
        setContentComponent(<LinkPages />);
    }
    const showUsers = () => {
        setContentComponent(<Users />);
    }

    return (
        <div className="main-grid">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="side">
                <div className="side-top">
                    <h4 className="linkpages" onClick={links}>Link Page</h4>
                    <h4 className="users" onClick={showUsers}>Data Page</h4>
                    <h4 className="charts" onClick={links}>Charts</h4>
                </div>
                <h4 className="logout" onClick={logout}>Logout</h4>
            </div>
            <div className="content">
                {contentComponent}
            </div>
        </div>
    )
}

export default Home
