import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/applications");
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Job Applications Admin Panel</h1>
        <p>Total Applications: {applications.length}</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>Applications will appear here once candidates start applying for jobs.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <h3>{application.jobTitle}</h3>
                <span className="company-name">{application.company}</span>
              </div>
              
              <div className="application-details">
                <div className="detail-row">
                  <strong>Applicant:</strong> {application.name}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {application.email}
                </div>
                <div className="detail-row">
                  <strong>Applied:</strong> {formatDate(application.appliedAt)}
                </div>
                <div className="detail-row">
                  <strong>Resume:</strong> 
                  <span className="resume-path">{application.resumePath.split('/').pop()}</span>
                </div>
              </div>

              <div className="application-actions">
                <button className="view-btn">View Resume</button>
                <button className="contact-btn">Contact Applicant</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


