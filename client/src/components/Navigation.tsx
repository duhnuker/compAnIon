import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav className='animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 fixed top-0 left-0 right-0 z-10'>
            <ul className='flex justify-center py-10'>
                <li className='px-6'><Link to="/dashboard" className="hover-underline-animation">Dashboard</Link></li>
                <li className='px-6'><Link to="/journalentries" className="hover-underline-animation">Your Entries</Link></li>
                <li className='px-6'><Link to="/yourprogress" className="hover-underline-animation">Your progress</Link></li>
                <li className='px-6'><Link to="/resources" className="hover-underline-animation">Resources</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation