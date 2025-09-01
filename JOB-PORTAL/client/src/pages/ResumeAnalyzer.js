import React, { useState } from "react";
import axios from "axios";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.analysis);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="analyzer-container">
      <h1>AI Resume Analyzer</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Analyze</button>
      </form>

      {result && (
        <div className="results">
          <h2>🧠 Resume Analysis Result</h2>
          <p><b>✅ Best Domain:</b> {result.bestDomain}</p>
          <p><b>📊 Resume Score:</b> {result.overallScore} / 100</p>
          <h3>🔍 Domain Scores:</h3>
          <ul>
            {Object.entries(result.domainScores).map(([domain, info]) => (
              <li key={domain}>
                <b>{domain}:</b> {info.score}% match ({info.matchedSkills.join(", ")})
              </li>
            ))}
          </ul>
          <h3>💼 Suggested Jobs:</h3>
          <ul>
            {result.suggestedJobs.map((job, i) => (
              <li key={i}>
                <b>{job.title}</b> at {job.company} ({job.location})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
