import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import JobCard from "../../components/user/JobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/jobs");
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>Available Jobs</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default Jobs;
