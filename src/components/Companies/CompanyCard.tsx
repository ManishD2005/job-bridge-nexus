
import { Building, MapPin, BriefcaseBusiness, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface CompanyProps {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  size: string;
  openPositions: number;
}

const CompanyCard = ({ company }: { company: CompanyProps }) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center mr-4 overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <p className="text-muted-foreground">{company.industry}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{company.size}</span>
          </div>
          <div className="flex items-center text-sm">
            <BriefcaseBusiness className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{company.openPositions} open positions</span>
          </div>
        </div>
        
        <div className="flex justify-between space-x-4">
          <Button variant="outline" className="w-1/2">
            Company Profile
          </Button>
          <Link to={`/companies/${company.id}/jobs`} className="w-1/2">
            <Button className="w-full">
              View Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
