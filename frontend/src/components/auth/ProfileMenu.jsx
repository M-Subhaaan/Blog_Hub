import { useState, useRef, useEffect } from 'react';
import './ProfileMenu.css';

const ProfileMenu = ({ onUpdateProfile, onChangePassword }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="profile-menu-container" ref={menuRef}>
            <button className="menu-toggle-btn" onClick={toggleMenu} aria-label="Toggle profile menu">
                <div className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {isOpen && (
                <div className="profile-dropdown-menu glass">
                    <button
                        className="dropdown-item"
                        onClick={() => {
                            onUpdateProfile();
                            setIsOpen(false);
                        }}
                    >
                        👤 Update Profile
                    </button>
                    <button
                        className="dropdown-item"
                        onClick={() => {
                            onChangePassword();
                            setIsOpen(false);
                        }}
                    >
                        🔑 Change Password
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
