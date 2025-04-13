
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import JobCard, { JobProps } from "./JobCard";

// Mock job data
const mockJobs: JobProps[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: {
      id: "1",
      name: "TechInnovate",
      logo: "",
    },
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    postedDate: "3 days ago",
    description: "We're looking for a skilled frontend developer to join our team. Experience with React, TypeScript, and modern web technologies required.",
  },
  {
    id: "2",
    title: "Data Scientist",
    company: {
      id: "6",
      name: "Data Insights",
      logo: "",
    },
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    postedDate: "1 week ago",
    description: "Join our data science team to develop machine learning models and extract insights from large datasets. Expertise in Python and ML frameworks needed.",
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: {
      id: "5",
      name: "Creative Digital",
      logo: "",
    },
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    postedDate: "2 days ago",
    description: "We're seeking a talented UX/UI designer to create innovative user experiences for our digital products. Strong portfolio required.",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: {
      id: "1",
      name: "TechInnovate",
      logo: "",
    },
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    postedDate: "5 days ago",
    description: "Come build and maintain our cloud infrastructure and CI/CD pipelines. Experience with AWS, Kubernetes, and automation tools required.",
  },
  {
    id: "5",
    title: "Marketing Intern",
    company: {
      id: "5",
      name: "Creative Digital",
      logo: "",
    },
    location: "Chicago, IL",
    type: "Internship",
    postedDate: "1 day ago",
    description: "Gain hands-on experience in digital marketing strategies, social media campaigns, and content creation with our growing team.",
  },
  {
    id: "6",
    title: "Financial Analyst",
    company: {
      id: "2",
      name: "Global Finance",
      logo: "",
    },
    location: "New York, NY",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    postedDate: "1 week ago",
    description: "Join our financial analysis team to evaluate market trends, prepare reports, and provide recommendations for investment strategies.",
  },
  {
    id: "7",
    title: "Backend Developer",
    company: {
      id: "1",
      name: "TechInnovate",
      logo: "",
    },
    location: "Remote",
    type: "Contract",
    salary: "$70/hr",
    postedDate: "4 days ago",
    description: "We're looking for an experienced backend developer to help scale our APIs and services. Node.js and database expertise required.",
  },
  {
    id: "8",
    title: "Healthcare Data Analyst",
    company: {
      id: "4",
      name: "Health Innovations",
      logo: "",
    },
    location: "Boston, MA",
    type: "Full-time",
    salary: "$90,000 - $115,000",
    postedDate: "2 weeks ago",
    description: "Analyze healthcare data to improve patient outcomes and operational efficiency. Experience with healthcare systems and data analysis required.",
  },
];

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState<string>("");
  
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !jobType || job.type === jobType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search job title, company, or location"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No jobs found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default JobList;
