const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  skills: [{ type: String }], // required skills
});

module.exports = mongoose.model("Job", JobSchema);
