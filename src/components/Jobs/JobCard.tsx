
import { Link } from "react-router-dom";
import { Building, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SaveJobButton from "./SaveJobButton";

export interface JobProps {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo: string;
  };
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary?: string;
  postedDate: string;
  description: string;
}

const JobCard = ({ job }: { job: JobProps }) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center mr-4 overflow-hidden">
            {job.company.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <Building className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
            <Link to={`/companies/${job.company.id}`} className="text-muted-foreground hover:text-primary transition-colors">
              {job.company.name}
            </Link>
          </div>
        </div>
        <SaveJobButton jobId={job.id} />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 mb-3">
        <Badge variant="secondary" className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {job.location}
        </Badge>
        <Badge variant="secondary" className="flex items-center">
          {job.type}
        </Badge>
        {job.salary && (
          <Badge variant="secondary">
            {job.salary}
          </Badge>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {job.description}
      </p>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Posted {job.postedDate}</span>
        </div>
        
        <Link to={`/jobs/${job.id}`}>
          <Button variant="default" size="sm">
            Apply Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
