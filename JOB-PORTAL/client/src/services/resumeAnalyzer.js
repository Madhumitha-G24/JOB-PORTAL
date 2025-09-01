import * as pdfjs from 'pdfjs-dist';

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map(item => item.str).join(' ');
  }
  
  return fullText;
};

export const analyzeResume = async (text) => {
  // Simple keyword extraction for skills
  const commonSkills = [
    'javascript', 'react', 'node', 'python', 'java', 'sql',
    'html', 'css', 'angular', 'vue', 'aws', 'docker',
    'kubernetes', 'mongodb', 'express', 'typescript'
  ];
  
  const skills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return skills;
};