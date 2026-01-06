import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuestLogin = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const performGuestLogin = async () => {
            try {
                const body = { email: "guest@gmail.com", password: "guest123" };
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/login`,
                    body,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
                const parseRes = response.data;

                if (parseRes.jwtToken) {
                    localStorage.setItem("token", parseRes.jwtToken);
                    setAuth(true);
                    navigate('/dashboard');
                } else {
                    setAuth(false);
                    navigate('/login');
                }
            } catch (err) {
                console.error(err instanceof Error ? err.message : "Guest login failed");
                navigate('/login');
            }
        };

        performGuestLogin();
    }, [setAuth, navigate]);

    return (
        <div className='h-screen w-full flex items-center justify-center bg-black'>
            <div className='flex flex-col items-center gap-4 text-white'>
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="animate-pulse">Logging in as Guest...</p>
            </div>
        </div>
    );
};

export default GuestLogin;
