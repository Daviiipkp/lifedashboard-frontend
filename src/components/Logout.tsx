import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
    const {logout} = useAuth();
    useEffect(() => {
        console.log("Executando logout..."); 
        logout();
    }, []);

    return <Navigate to="/login" replace />;
};

export default Logout;