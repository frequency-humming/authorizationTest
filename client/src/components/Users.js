import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { BeatLoader } from 'react-spinners';

const Users = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const {auth} = useAuth();

    useEffect(() => {
        console.log('in user '+auth);
        setIsLoading(true);
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }finally{
                setIsLoading(false);
            }
        }

        getUsers();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [axiosPrivate,navigate,location,auth])

    return (
            isLoading ?
                (
                <div>
                    <BeatLoader />
                </div>
                )
                :
                (
                <article>
                    <h2>Users List</h2>
                    {users?.length
                        ? (
                            <ul>
                                {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                            </ul>
                        ) : <p>No users to display</p>
                    }
                </article>
                )
            );
};

export default Users;
