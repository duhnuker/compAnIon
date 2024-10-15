import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav>
            <ul className='flex py-10'>
                <li className='pr-6'><Link to="/dashboard" className="hover-underline-animation">Dashboard</Link></li>
                <li className='pr-6'><Link to="/yourprogress" className="hover-underline-animation">Your progress</Link></li>
                <li><Link to="/resources" className="hover-underline-animation">Resources</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation