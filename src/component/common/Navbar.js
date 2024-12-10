import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingBag, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Navbar = () => {
  return (
    <header className="header_section">
      <nav className="navbar navbar-expand-lg custom_nav-container">
        <a className="navbar-brand" href="index.html">
          <span>SuperMarket Online</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item dropdown">
  <a className="nav-link dropdown-toggle" href="product" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Shop
  </a>
  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
    <a className="dropdown-item" href="category1">Home Appliances</a>
    <a className="dropdown-item" href="category2">Kitchen Appliances</a>
    <a className="dropdown-item" href="category3">Repair Tools</a>
    <div className="dropdown-divider"></div>
    <a className="dropdown-item" href="category4">Frozen Food</a>
    <a className="dropdown-item" href="category5">Fresh Food</a>
    <a className="dropdown-item" href="category6">Fast Food</a>
    <div className="dropdown-divider"></div>
    <a className="dropdown-item" href="all-products">All Products</a>
  </div>
</li>
            
            <li className="nav-item">
              <a className="nav-link" href="comment">Comment</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="contact">Contact Us</a>
            </li>
          </ul>
          <div className="user_option">
            <a href="login">
              <FontAwesomeIcon icon={faUser} aria-hidden="true" />
              <span>Login</span>
            </a>
            
            <form className="form-inline">
              <button className="btn nav_search-btn" type="submit">
                <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;