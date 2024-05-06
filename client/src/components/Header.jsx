import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Header = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (

        <nav id="navbar" class="navbar">
            <ul>
                <li><Link to='/' class="nav-link scrollto active" href="#hero">Home</Link></li>
                <li><Link to='/about' class="nav-link scrollto" href="#about">About</Link></li>


                <li><Link to='/profile' className='img'>
                    {currentUser ? (
                        <img
                            src={currentUser.profile_picture}
                            alt='profile'
                            className='h-7 w-7 rounded-full object-cover'
                        />
                    ) : (
                        'Login'
                    )}
                </Link></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
        </nav>
    );
};
export default Header;
