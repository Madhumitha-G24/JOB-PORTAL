module.exports = {
  // MongoDB Configuration
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/jobportal",
  
  // Email Configuration
  email: {
    service: "gmail",
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
    from: process.env.EMAIL_FROM || "your-email@gmail.com"
  },
  
  // Server Configuration
  port: process.env.PORT || 5000,
  
  // Company Information
  company: {
    name: "JobPortal",
    supportEmail: "support@jobportal.com",
    website: "http://localhost:3000"
  }
};


