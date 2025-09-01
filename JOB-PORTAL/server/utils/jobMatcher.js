// Expanded Job Dataset - at least 5 jobs per skill
const jobDatabase = {
  "React": [
    { title: "Frontend Developer", company: "Google", location: "Bangalore" },
    { title: "React Engineer", company: "Microsoft", location: "Hyderabad" },
    { title: "UI Developer", company: "Amazon", location: "Chennai" },
    { title: "Frontend Specialist", company: "Infosys", location: "Pune" },
    { title: "React Web Developer", company: "Wipro", location: "Delhi" },
  ],
  "Node.js": [
    { title: "Backend Developer", company: "Amazon", location: "Bangalore" },
    { title: "Node.js Engineer", company: "TCS", location: "Hyderabad" },
    { title: "API Developer", company: "Accenture", location: "Chennai" },
    { title: "Server-side Dev", company: "Cognizant", location: "Kolkata" },
    { title: "Node.js Backend", company: "HCL", location: "Noida" },
  ],
  "MongoDB": [
    { title: "Database Engineer", company: "Oracle", location: "Bangalore" },
    { title: "MongoDB Developer", company: "IBM", location: "Hyderabad" },
    { title: "NoSQL Engineer", company: "Capgemini", location: "Chennai" },
    { title: "Data Specialist", company: "Tech Mahindra", location: "Pune" },
    { title: "DB Admin", company: "Deloitte", location: "Delhi" },
  ],
  "JavaScript": [
    { title: "Software Engineer", company: "Adobe", location: "Bangalore" },
    { title: "Full Stack JS Dev", company: "Zoho", location: "Chennai" },
    { title: "Frontend Dev", company: "Paytm", location: "Noida" },
    { title: "JS Developer", company: "Swiggy", location: "Hyderabad" },
    { title: "Web Engineer", company: "Zomato", location: "Delhi" },
  ],
  "Python": [
    { title: "Data Engineer", company: "Google", location: "Hyderabad" },
    { title: "AI Developer", company: "OpenAI", location: "Remote" },
    { title: "Backend Dev", company: "Infosys", location: "Bangalore" },
    { title: "ML Engineer", company: "Walmart Labs", location: "Chennai" },
    { title: "Software Engineer", company: "CTS", location: "Pune" },
  ],
};

function matchJobs(skills) {
  let matches = [];
  skills.forEach((skill) => {
    if (jobDatabase[skill]) {
      matches = matches.concat(jobDatabase[skill]);
    }
  });
  return matches.length ? matches : [{ title: "No jobs found", company: "-", location: "-" }];
}

module.exports = { matchJobs };
