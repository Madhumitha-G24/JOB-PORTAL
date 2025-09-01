const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const config = require("./config");
const Application = require("./models/Application");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(config.mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Job database
const jobs = [
  { title: "Full Stack Developer", company: "TechCorp", skills: ["React", "Node.js", "MongoDB", "Express"] },
  { title: "Frontend Developer", company: "InnoSoft", skills: ["React", "CSS", "JavaScript"] },
  { title: "Backend Developer", company: "CodeWorks", skills: ["Node.js", "Express", "PostgreSQL"] },
  { title: "Data Scientist", company: "AI Labs", skills: ["Python", "TensorFlow", "Machine Learning"] },
  { title: "Cloud Engineer", company: "Cloudify", skills: ["AWS", "Docker", "Kubernetes"] },
  { title: "DevOps Engineer", company: "NextGen Systems", skills: ["Docker", "Kubernetes", "CI/CD"] },
  { title: "Mobile App Developer", company: "AppVerse", skills: ["React Native", "JavaScript", "MongoDB"] },
  { title: "Software Engineer", company: "TechNova", skills: ["Java", "Python", "SQL"] },
  { title: "AI Engineer", company: "DeepMind Labs", skills: ["Python", "Machine Learning", "NLP"] },
];

// Skills to detect
const skillKeywords = ["React","Node.js","MongoDB","Express","Python","TensorFlow","Machine Learning","AWS","Docker","Kubernetes","JavaScript","PostgreSQL","React Native","CI/CD","CSS","Java","SQL","NLP"];

// Resume Analysis Endpoint
app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No resume uploaded" });

    const dataBuffer = fs.readFileSync(req.file.path);
    let resumeText = "";

    try {
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text.toLowerCase();
    } catch (err) {
      console.warn("PDF parse failed, using default skills");
    }

    // Extract skills
    let extractedSkills = skillKeywords.filter(skill =>
      resumeText.includes(skill.toLowerCase())
    );

    // Fallback if PDF text is empty
    if (extractedSkills.length === 0) extractedSkills = ["React","Node.js","MongoDB","Python","AWS"];

    // Match jobs
    let matchedJobs = jobs.filter(job =>
      job.skills.some(skill => extractedSkills.includes(skill))
    );

    // Ensure at least 5 jobs
    while (matchedJobs.length < 5) {
      const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
      if (!matchedJobs.includes(randomJob)) matchedJobs.push(randomJob);
    }

    res.json({ skills: extractedSkills, jobs: matchedJobs });

    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error("Resume analysis error:", err);
    res.status(500).json({ error: "Error analyzing resume!" });
  }
});

// Job Application Endpoint
app.post("/api/apply", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, address, jobTitle, company } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !address || !jobTitle || !company) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required: name, email, phone, address, jobTitle, company" 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "Resume file is required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address"
      });
    }

    // Create new application
    const application = new Application({
      name,
      email,
      phone,
      address,
      jobTitle,
      company,
      resumePath: req.file.path
    });

    // Save to database
    await application.save();

    // Try to send confirmation email (optional - won't crash if email fails)
    try {
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: `Application Confirmation - ${jobTitle} at ${company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Application Confirmation</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Your application for the position <strong>${jobTitle}</strong> at <strong>${company}</strong> has been successfully submitted.
              </p>
              <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Thank you for applying through our portal. You will receive further updates regarding your application status via email.
              </p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Application Details:</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                <p style="margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
                <p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>
                <p style="margin: 5px 0;"><strong>Application ID:</strong> ${application._id}</p>
                <p style="margin: 5px 0;"><strong>Applied Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">
                Best regards,<br>
                <strong>${config.company.name}</strong><br>
                <a href="mailto:${config.company.supportEmail}" style="color: #667eea;">${config.company.supportEmail}</a><br>
                <a href="${config.company.website}" style="color: #667eea;">${config.company.website}</a>
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (emailError) {
      console.warn("⚠️ Email sending failed, but application was saved:", emailError.message);
      // Don't fail the application submission if email fails
    }

    // Return success response
    res.status(201).json({ 
      success: true,
      message: "Application submitted successfully! Check your email for confirmation.",
      applicationId: application._id,
      application: {
        name,
        email,
        jobTitle,
        company,
        appliedAt: application.appliedAt
      }
    });

  } catch (error) {
    console.error("Application submission error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation error: " + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "An application with this email for this position already exists"
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Error submitting application. Please try again." 
    });
  }
});

// Get all applications (for admin panel)
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Error fetching applications" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running" });
});

app.listen(config.port, () => console.log(`✅ Server running on http://localhost:${config.port}`));
