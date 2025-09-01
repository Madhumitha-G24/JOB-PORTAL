const mongoose = require('mongoose');
const Job = require('./models/Job');

mongoose.connect('mongodb://localhost:27017/jobportal', { useNewUrlParser: true, useUnifiedTopology: true });

const jobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    location: "Remote",
    skillsRequired: ["JavaScript", "React", "HTML", "CSS"],
    description: "Work on Google Search UI."
  },
  {
    title: "Backend Developer",
    company: "Amazon",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    location: "Bangalore, India",
    skillsRequired: ["Node.js", "MongoDB", "AWS"],
    description: "Build scalable backend services."
  },
  // ...add 100+ jobs with various companies and skills
];

async function seed() {
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log("Database seeded!");
  mongoose.disconnect();
}

seed();