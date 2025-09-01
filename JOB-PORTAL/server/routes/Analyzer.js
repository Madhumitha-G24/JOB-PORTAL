const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdf = require("pdf-parse");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Predefined domains + skills
const jobDomains = {
  "Full Stack Web Developer": [
    "html", "css", "javascript", "react", "node", "express",
    "mongodb", "sql", "api", "bootstrap", "frontend", "backend"
  ],
  "AI/ML Engineer": [
    "python", "machine learning", "deep learning", "pandas", "numpy",
    "tensorflow", "keras", "nlp", "scikit", "matplotlib"
  ],
  "Cloud Engineer": [
    "aws", "azure", "gcp", "docker", "kubernetes",
    "devops", "linux", "terraform", "cloud"
  ],
  "Cybersecurity": [
    "network security", "penetration testing", "nmap", "wireshark",
    "burp", "firewall", "vulnerability", "malware", "encryption"
  ]
};

// Example jobs DB (replace with MongoDB collection later)
const jobs = {
  "Full Stack Web Developer": [
    { title: "Frontend React Developer", company: "TechCorp", location: "Bangalore" },
    { title: "MERN Stack Developer", company: "Digital Solutions", location: "Chennai" }
  ],
  "AI/ML Engineer": [
    { title: "ML Engineer", company: "AI Labs", location: "Hyderabad" },
    { title: "Data Scientist", company: "InnoTech", location: "Remote" }
  ],
  "Cloud Engineer": [
    { title: "Cloud DevOps Engineer", company: "Cloudify", location: "Pune" },
    { title: "AWS Solutions Architect", company: "NextGen Systems", location: "Remote" }
  ],
  "Cybersecurity": [
    { title: "Security Analyst", company: "CyberSafe", location: "Delhi" },
    { title: "Penetration Tester", company: "SecureTech", location: "Mumbai" }
  ]
};

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const data = await pdf(req.file.buffer);
    const text = data.text.toLowerCase();

    // Compute scores
    let domainScores = {};
    for (let domain in jobDomains) {
      const skills = jobDomains[domain];
      const matches = skills.filter((skill) => text.includes(skill));
      const score = Math.round((matches.length / skills.length) * 100);
      domainScores[domain] = { score, matchedSkills: matches };
    }

    // Best domain
    const bestDomain = Object.keys(domainScores).reduce((a, b) =>
      domainScores[a].score > domainScores[b].score ? a : b
    );

    // Average overall score
    const overallScore = Math.round(
      Object.values(domainScores).reduce((sum, obj) => sum + obj.score, 0) /
        Object.keys(domainScores).length
    );

    res.json({
      analysis: {
        bestDomain,
        overallScore,
        domainScores,
        suggestedJobs: jobs[bestDomain] || []
      }
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
});

module.exports = router;
