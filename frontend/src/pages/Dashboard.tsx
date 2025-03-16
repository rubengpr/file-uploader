import { Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth.ts';

export default function Dashboard() {
    if (!isAuthenticated()) {
        return <Navigate to='/login' replace />;
    }

    return (
        <>
            <h1>Welcome to the dashboard!</h1>
            <p>Here some random text I don't know what to put</p>
            <button onClick={logout}>Log out</button>
        </>
    );
}