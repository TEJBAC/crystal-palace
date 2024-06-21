import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../Context/AuthContext'; // Update the path as per your project structure

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src="images/crystal_palace.logo.jpg" width="50" height="50" className="d-inline-block align-top" alt="Logo" />
        <em>Crystal Palace</em>
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item"><Link className="nav-link" to="/gallery">Gallery</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
          {isAuthenticated ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/logout">Logout</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
            </>
          ) : (
            <>
            <li className="nav-item"><Link className="nav-link" to="/membership_signup">Membership Signup</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
