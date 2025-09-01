import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><b>Company:</b> {job.company}</p>
      <p><b>Location:</b> {job.location}</p>
      <p><b>Skills:</b> {job.skillsRequired.join(", ")}</p>
      <Link to={`/apply/${job._id}`}>
        <button>Apply</button>
      </Link>
    </div>
  );
}
