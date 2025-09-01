import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ResumeUpload from "./components/ResumeUpload";
import ApplyForm from "./pages/ApplyForm";
import AdminPanel from "./pages/AdminPanel";
import Results from "./pages/Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<ResumeUpload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/apply/:jobId" element={<ApplyForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
