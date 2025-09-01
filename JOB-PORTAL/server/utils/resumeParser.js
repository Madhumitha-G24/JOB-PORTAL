import pdfParse from "pdf-parse";
import fs from "fs";

const skillsList = [
  "React", "Node.js", "MongoDB", "Express", "JavaScript", "Python",
  "Django", "Flask", "Java", "Spring Boot", "AWS", "Docker",
  "Kubernetes", "C++", "SQL", "PostgreSQL", "HTML", "CSS",
  "Tailwind", "TypeScript", "Next.js", "Angular"
];

export async function parseResume(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    const text = data.text.toLowerCase();
    const extractedSkills = skillsList.filter(skill =>
      text.includes(skill.toLowerCase())
    );

    return extractedSkills;
  } catch (error) {
    console.error("Resume parsing error:", error.message);
    throw error;
  }
}
