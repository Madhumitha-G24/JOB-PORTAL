import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-logo">JobPortal</div>
      <div className={`navbar-links ${isMobile ? "active" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/resume">Resume Analyzer</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/companies">Companies</Link>
      </div>
      <div className="hamburger" onClick={() => setIsMobile(!isMobile)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
