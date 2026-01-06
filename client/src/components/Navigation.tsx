import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC<{ setAuth: (auth: boolean) => void }> = ({ setAuth }) => {
    const logout = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            setAuth(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className='animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 fixed top-0 left-0 right-0 z-10'>
            <ul className='flex justify-center py-10 items-center'>
                <li className='px-6'><Link to="/dashboard" className="hover-underline-animation">Dashboard</Link></li>
                <li className='px-6'><Link to="/journalentries" className="hover-underline-animation">Your Entries</Link></li>
                <li className='px-6'><Link to="/yourprogress" className="hover-underline-animation">Your progress</Link></li>
                <li className='px-6'><Link to="/resources" className="hover-underline-animation">Resources</Link></li>
                <li className='px-6 duration-300 text-white hover:text-red-500 cursor-pointer' onClick={logout}>Logout</li>
            </ul>
        </nav>
    )
}

export default Navigation