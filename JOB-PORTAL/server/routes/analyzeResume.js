import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseResume } from "../utils/resumeParser.js";
import Job from "../models/job.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const skills = await parseResume(req.file.path);

    // Find jobs where requiredSkills overlap with resume skills
    const jobs = await Job.find({
      requiredSkills: { $in: skills },
    }).limit(5);

    // cleanup
    fs.unlinkSync(req.file.path);

    res.json({ skills, jobs });
  } catch (err) {
    console.error("Error analyzing resume:", err.message);
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

export default router;
