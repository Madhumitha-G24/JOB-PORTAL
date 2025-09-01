const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  resumePath: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

// Create a compound unique index to prevent duplicate applications
applicationSchema.index({ email: 1, jobTitle: 1, company: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
