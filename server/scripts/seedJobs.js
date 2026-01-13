import mongoose from "mongoose";
import Job from "../models/Job.js";

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechSoft",
    location: "Ahmedabad",
    jobType: "Full Time",
    salary: "₹6,00,000",
    description: "React.js, UI/UX, HTML, CSS, JS",
    technology: ["React", "HTML", "CSS", "JavaScript"],
    technologyName: "React.js",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "Backend Developer",
    company: "CodeBase",
    location: "Surat",
    jobType: "Full Time",
    salary: "₹7,50,000",
    description: "Node.js, Express, MongoDB",
    technology: ["Node.js", "Express", "MongoDB"],
    technologyName: "Node.js",
    experience: "3+ years",
    experienceValue: "Senior"
  },
  {
    title: "Java Developer",
    company: "Enterprise Apps",
    location: "Vadodara",
    jobType: "Full Time",
    salary: "₹8,00,000",
    description: "Java, Spring Boot, REST APIs",
    technology: ["Java", "Spring Boot"],
    technologyName: "Java",
    experience: "2-4 years",
    experienceValue: "Mid-level"
  },
  {
    title: "Python Developer",
    company: "DataWiz",
    location: "Rajkot",
    jobType: "Full Time",
    salary: "₹7,00,000",
    description: "Python, Django, REST APIs",
    technology: ["Python", "Django"],
    technologyName: "Python",
    experience: "1-3 years",
    experienceValue: "Junior"
  },
  {
    title: "Android Developer",
    company: "MobileX",
    location: "Gandhinagar",
    jobType: "Full Time",
    salary: "₹6,50,000",
    description: "Android, Java, Kotlin",
    technology: ["Android", "Java", "Kotlin"],
    technologyName: "Android",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "iOS Developer",
    company: "Appify",
    location: "Bhavnagar",
    jobType: "Full Time",
    salary: "₹7,20,000",
    description: "iOS, Swift, Objective-C",
    technology: ["iOS", "Swift", "Objective-C"],
    technologyName: "iOS",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "Full Stack Developer",
    company: "StackPro",
    location: "Jamnagar",
    jobType: "Full Time",
    salary: "₹9,00,000",
    description: "React, Node.js, MongoDB",
    technology: ["React", "Node.js", "MongoDB"],
    technologyName: "MERN",
    experience: "3+ years",
    experienceValue: "Senior"
  },
  {
    title: "DevOps Engineer",
    company: "CloudOps",
    location: "Junagadh",
    jobType: "Full Time",
    salary: "₹10,00,000",
    description: "AWS, Docker, CI/CD",
    technology: ["AWS", "Docker", "CI/CD"],
    technologyName: "DevOps",
    experience: "4+ years",
    experienceValue: "Senior"
  },
  {
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Anand",
    jobType: "Full Time",
    salary: "₹5,50,000",
    description: "Figma, Adobe XD, Sketch",
    technology: ["Figma", "Adobe XD", "Sketch"],
    technologyName: "UI/UX",
    experience: "1-2 years",
    experienceValue: "Junior"
  },
  {
    title: "QA Engineer",
    company: "QualityFirst",
    location: "Nadiad",
    jobType: "Full Time",
    salary: "₹5,80,000",
    description: "Manual, Automation, Selenium",
    technology: ["Manual", "Automation", "Selenium"],
    technologyName: "QA",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "PHP Developer",
    company: "WebWorks",
    location: "Vapi",
    jobType: "Full Time",
    salary: "₹6,20,000",
    description: "PHP, Laravel, MySQL",
    technology: ["PHP", "Laravel", "MySQL"],
    technologyName: "PHP",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "C# Developer",
    company: "DotNet Solutions",
    location: "Mehsana",
    jobType: "Full Time",
    salary: "₹7,10,000",
    description: "C#, .NET, SQL Server",
    technology: ["C#", ".NET", "SQL Server"],
    technologyName: "C#/.NET",
    experience: "3+ years",
    experienceValue: "Senior"
  },
  {
    title: "C++ Developer",
    company: "AlgoTech",
    location: "Navsari",
    jobType: "Full Time",
    salary: "₹7,00,000",
    description: "C++, STL, Algorithms",
    technology: ["C++", "STL", "Algorithms"],
    technologyName: "C++",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "Flutter Developer",
    company: "AppFusion",
    location: "Bharuch",
    jobType: "Full Time",
    salary: "₹6,80,000",
    description: "Flutter, Dart, Mobile Apps",
    technology: ["Flutter", "Dart"],
    technologyName: "Flutter",
    experience: "1-2 years",
    experienceValue: "Junior"
  },
  {
    title: "Angular Developer",
    company: "WebGenius",
    location: "Morbi",
    jobType: "Full Time",
    salary: "₹7,30,000",
    description: "Angular, TypeScript, RxJS",
    technology: ["Angular", "TypeScript", "RxJS"],
    technologyName: "Angular",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "Data Scientist",
    company: "DataMinds",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹12,00,000",
    description: "Python, ML, Data Analysis",
    technology: ["Python", "ML", "Data Analysis"],
    technologyName: "Data Science",
    experience: "3+ years",
    experienceValue: "Senior"
  },
  {
    title: "AI Engineer",
    company: "AIBrain",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹13,00,000",
    description: "AI, Deep Learning, Python",
    technology: ["AI", "Deep Learning", "Python"],
    technologyName: "AI/ML",
    experience: "3+ years",
    experienceValue: "Senior"
  },
  {
    title: "Business Analyst",
    company: "BizAnalytics",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹8,50,000",
    description: "Business Analysis, SQL, Excel",
    technology: ["SQL", "Excel"],
    technologyName: "Business Analysis",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "Cloud Engineer",
    company: "CloudNet",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹11,00,000",
    description: "AWS, Azure, GCP",
    technology: ["AWS", "Azure", "GCP"],
    technologyName: "Cloud",
    experience: "3+ years",
    experienceValue: "Senior"
  },
  {
    title: "Network Engineer",
    company: "NetSecure",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹7,80,000",
    description: "Networking, Security, Cisco",
    technology: ["Networking", "Security", "Cisco"],
    technologyName: "Networking",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "Project Manager",
    company: "PMO Solutions",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹15,00,000",
    description: "Project Management, Agile, Scrum",
    technology: ["Agile", "Scrum"],
    technologyName: "Project Management",
    experience: "5+ years",
    experienceValue: "Lead"
  },
  {
    title: "SAP Consultant",
    company: "SAPify",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹14,00,000",
    description: "SAP, ERP, Consulting",
    technology: ["SAP", "ERP"],
    technologyName: "SAP",
    experience: "4+ years",
    experienceValue: "Senior"
  },
  {
    title: "Game Developer",
    company: "GameOn",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹9,50,000",
    description: "Unity, C#, Game Design",
    technology: ["Unity", "C#"],
    technologyName: "Game Development",
    experience: "2+ years",
    experienceValue: "Mid-level"
  },
  {
    title: "SEO Specialist",
    company: "WebRank",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹5,60,000",
    description: "SEO, SEM, Google Analytics",
    technology: ["SEO", "SEM", "Google Analytics"],
    technologyName: "SEO",
    experience: "1-2 years",
    experienceValue: "Junior"
  },
  {
    title: "Content Writer",
    company: "WriteRight",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹4,80,000",
    description: "Content Writing, Blogs, Copywriting",
    technology: ["Content Writing", "Blogs", "Copywriting"],
    technologyName: "Content",
    experience: "1+ years",
    experienceValue: "Junior"
  },
  {
    title: "Support Engineer",
    company: "SupportPro",
    location: "Out of Gujarat",
    jobType: "Full Time",
    salary: "₹6,00,000",
    description: "Technical Support, Customer Service",
    technology: ["Technical Support", "Customer Service"],
    technologyName: "Support",
    experience: "2+ years",
    experienceValue: "Mid-level"
  }
];

async function seedJobs() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal');
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log('25 jobs inserted!');
  process.exit();
}

seedJobs();
