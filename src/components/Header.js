// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header id="home" className="jumbotron jumbotron-fluid text-center text-white">
      <div className="container">
        <h1 className="display-4">Welcome to Crystal Palace Banquet Hall</h1>
        <p className="lead">Experience luxury and elegance for your events</p>
        <Link to="/booking" className="btn btn-primary">Book Now</Link>
      </div>
    </header>
  );
};

export default Header;
