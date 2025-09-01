import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCode, FaBriefcase, FaArrowLeft, FaCheckCircle, FaBuilding } from "react-icons/fa";
import "./Results.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { skills = [], jobs = [], resumeName = "" } = location.state || {};

  if (!skills.length && !jobs.length) {
    return (
      <div className="results-container">
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>Please go back and analyze your resume first.</p>
          <button onClick={() => navigate("/upload")} className="back-btn">
            <FaArrowLeft /> Back to Upload
          </button>
        </div>
      </div>
    );
  }

  const handleApply = (job) => {
    navigate(`/apply/${job.title}`, { state: { job } });
  };

  const handleBackToUpload = () => {
    navigate("/upload");
  };

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <button onClick={handleBackToUpload} className="back-btn">
          <FaArrowLeft /> Back to Upload
        </button>
        <div className="header-content">
          <h1>Resume Analysis Results</h1>
          <p>Analysis completed for: <strong>{resumeName}</strong></p>
        </div>
      </div>

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="skills-section">
          <div className="section-header">
            <FaCode className="section-icon" />
            <h2>Extracted Skills</h2>
            <span className="skill-count">{skills.length} skills found</span>
          </div>
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-card">
                <FaCheckCircle className="skill-icon" />
                <span className="skill-name">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs Section */}
      {jobs.length > 0 && (
        <div className="jobs-section">
          <div className="section-header">
            <FaBriefcase className="section-icon" />
            <h2>Matched Jobs</h2>
            <span className="job-count">{jobs.length} opportunities found</span>
          </div>
          <div className="jobs-grid">
            {jobs.map((job, idx) => (
              <div key={idx} className="job-card">
                <div className="job-header">
                  <div className="job-title-section">
                    <h3>{job.title}</h3>
                    <div className="company-info">
                      <FaBuilding className="company-icon" />
                      <span className="company-name">{job.company}</span>
                    </div>
                  </div>
                </div>
                
                <div className="job-skills-section">
                  <h4>Required Skills:</h4>
                  <div className="job-skills-tags">
                    {job.skills.map((skill, skillIdx) => (
                      <span key={skillIdx} className="job-skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-actions">
                  <button 
                    className="apply-btn"
                    onClick={() => handleApply(job)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>Analysis Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">{skills.length}</span>
              <span className="stat-label">Skills Extracted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{jobs.length}</span>
              <span className="stat-label">Jobs Matched</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Math.round((skills.length / jobs.length) * 100)}%</span>
              <span className="stat-label">Match Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
