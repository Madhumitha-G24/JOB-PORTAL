// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLaptopCode, FaBullhorn, FaPaintBrush, FaFileAlt } from "react-icons/fa";
import "./Home.css";

// Example company logos (replace URLs with real company logo URLs as needed)
const companies = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="homepage-container">
      {/* Hero Section */}
      <section
        className="hero job-hero-bg"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-content hero-content-glass">
          <h1 className="hero-title">💼 Find Your Dream Job</h1>
          <p className="hero-desc">
            Upload your resume and let us find the best jobs for you 🚀
          </p>
          <button
            className="search-btn main-cta"
            onClick={() => navigate("/upload")}
          >
            🔍 Search Jobs
          </button>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="company-list-section">
        <h2 className="section-title">Companies Hiring Now</h2>
        <div className="company-logos">
          {companies.map((company) => (
            <div className="company-logo-card" key={company.name} title={company.name}>
              <img src={company.logo} alt={company.name + ' logo'} className="company-logo-img no-border" />
              <span className="company-logo-name">{company.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="job-categories-section">
        <h2 className="section-title">Popular Job Categories</h2>
        <div className="job-categories">
          <div className="job-card">
            <FaLaptopCode className="job-icon" />
            <h3>IT & Software</h3>
            <p>Explore tech jobs: developer, tester, analyst, and more.</p>
          </div>
          <div className="job-card">
            <FaBullhorn className="job-icon" />
            <h3>Marketing</h3>
            <p>Find roles in digital marketing, SEO, content, and branding.</p>
          </div>
          <div className="job-card">
            <FaPaintBrush className="job-icon" />
            <h3>Design</h3>
            <p>Discover opportunities in UI/UX, graphic, and product design.</p>
          </div>
        </div>
      </section>

      {/* Resume Analyzer Section */}
      <section className="resume-analyzer-section">
        <div className="resume-analyzer-card">
          <FaFileAlt className="resume-icon" />
          <div>
            <h2>Resume Analyzer</h2>
            <p>
              Upload your resume and get instant feedback on your skills, experience, and job match. Improve your chances of landing your dream job!
            </p>
            <button
              className="analyze-btn"
              onClick={() => navigate("/upload")}
            >
              📄 Analyze My Resume
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
