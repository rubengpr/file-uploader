import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth.ts';
import { useEffect } from 'react';

export default function Dashboard() {
    
        const navigate = useNavigate();
        
        useEffect(() => {
            if (isAuthenticated()) {
              navigate('/dashboard');
            } else {
              navigate('/login');
            }
          }, [navigate]);

    return (
        <>
            <h1>Welcome to the dashboard!</h1>
            <p>Here some random text I don't know what to put</p>
            <button onClick={logout}>Log out</button>
        </>
    );
};