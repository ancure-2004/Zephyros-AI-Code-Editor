import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            console.error('Authentication error:', error);
            navigate('/login?error=' + encodeURIComponent(error));
            return;
        }

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                
                // Store token and user data
                localStorage.setItem('token', token);
                setUser(user);
                
                // Navigate to projects
                navigate('/projects');
            } catch (err) {
                console.error('Error parsing user data:', err);
                navigate('/login?error=Invalid+authentication+data');
            }
        } else {
            navigate('/login?error=Missing+authentication+data');
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;