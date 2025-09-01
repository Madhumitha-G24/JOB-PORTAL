import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFilePdf, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import "./ResumeAnalyzer.css";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError("");
    } else {
      setError("Please select a valid PDF file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError("");
    } else {
      setError("Please drop a valid PDF file.");
    }
  };

  const handleAnalyze = async () => {
    if (!resume) {
      setError("Please upload a resume file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await axios.post("http://localhost:5000/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Navigate to results page with the data
      navigate("/results", { 
        state: { 
          skills: response.data.skills || [],
          jobs: response.data.jobs || [],
          resumeName: resume.name
        } 
      });
    } catch (err) {
      console.error(err);
      setError("Error analyzing resume! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="resume-upload-container">
      <div className="upload-header">
        <h2><FaUpload className="header-icon" /> Resume Analyzer</h2>
        <p>Upload your resume to discover matching job opportunities</p>
      </div>

      {/* File Upload Section */}
      <div className="upload-section">
        <div 
          className={`file-drop-zone ${isDragOver ? 'drag-over' : ''} ${resume ? 'file-selected' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {!resume ? (
            <>
              <FaFilePdf className="upload-icon" />
              <h3>Drop your resume here or click to browse</h3>
              <p>Supports PDF files only</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </>
          ) : (
            <div className="file-info">
              <FaFilePdf className="file-icon" />
              <div className="file-details">
                <h4>{resume.name}</h4>
                <p>{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button className="remove-file" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <FaTimes className="error-icon" />
            {error}
          </div>
        )}

        <button 
          className="analyze-btn"
          onClick={handleAnalyze} 
          disabled={loading || !resume}
        >
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <FaCheck />
              Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
