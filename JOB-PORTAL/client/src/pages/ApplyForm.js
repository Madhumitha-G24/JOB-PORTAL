import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApplyForm.css";

const ApplyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) {
    return (
      <div className="apply-page-container">
        <div className="error-message">
          <h2>No job selected!</h2>
          <p>Please go back and select a job to apply for.</p>
          <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }

    if (!resume) {
      setMessage("Please upload your resume.");
      setIsSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("address", address.trim());
    formData.append("jobTitle", job.title);
    formData.append("company", job.company);
    formData.append("resume", resume);

    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await axios.post("http://localhost:5000/api/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Check if the response indicates success
      if (response.data.success || response.status === 201) {
        setIsSuccess(true);
        setMessage(response.data.message || "Application submitted successfully!");
        
        // Clear form
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setResume(null);
        
        // Show success message for 5 seconds then redirect
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setIsSuccess(false);
        setMessage(response.data.error || "Failed to submit application");
      }
    } catch (err) {
      console.error("Application error:", err);
      setIsSuccess(false);
      
      // Handle different types of errors
      if (err.response?.data?.error) {
        setMessage(err.response.data.error);
      } else if (err.response?.status === 400) {
        setMessage("Please check your input and try again.");
      } else if (err.response?.status === 500) {
        setMessage("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR') {
        setMessage("Network error. Please check your connection and try again.");
      } else {
        setMessage("Failed to submit application. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setResume(null);
    setMessage("");
    setIsSuccess(false);
  };

  return (
    <div className="apply-page-container">
      {/* Job/Company Info Card */}
      <div className="company-info-card">
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        {job.skills && (
          <p><strong>Required Skills:</strong> {job.skills.join(", ")}</p>
        )}
      </div>

      {/* Application Form */}
      <div className="apply-form-card">
        <h3>Apply for this Job</h3>
        
        {isSuccess ? (
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h4>Application Submitted Successfully!</h4>
            <p>{message}</p>
            <div className="success-details">
              <p><strong>Job:</strong> {job.title}</p>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Applied by:</strong> {name}</p>
            </div>
            <p className="redirect-message">You will be redirected to the home page in a few seconds...</p>
            <button onClick={() => navigate("/")} className="home-btn">
              Go to Home Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                Your Name: <span className="required">*</span>
              </label>
              <input 
                type="text" 
                id="name"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Your Email: <span className="required">*</span>
              </label>
              <input 
                type="email" 
                id="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                Phone Number: <span className="required">*</span>
              </label>
              <textarea
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
                rows={2}
                style={{ resize: 'none' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">
                Address: <span className="required">*</span>
              </label>
              <textarea
                id="address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Enter your address"
                rows={2}
                style={{ resize: 'none' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="resume">
                Resume (PDF): <span className="required">*</span>
              </label>
              <input 
                type="file" 
                id="resume"
                accept=".pdf" 
                onChange={e => setResume(e.target.files[0])} 
                required 
              />
              <small>Please upload your resume in PDF format</small>
            </div>
            <div className="button-group">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              {!loading && (
                <button type="button" onClick={resetForm} className="reset-btn">
                  Reset Form
                </button>
              )}
            </div>
          </form>
        )}
        
        {message && !isSuccess && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyForm;
