
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CompanyCard, { CompanyProps } from "./CompanyCard";

// Mock company data
const mockCompanies: CompanyProps[] = [
  {
    id: "1",
    name: "TechInnovate",
    logo: "",
    industry: "Software Development",
    location: "San Francisco, CA",
    size: "500-1000 employees",
    openPositions: 12,
  },
  {
    id: "2",
    name: "Global Finance",
    logo: "",
    industry: "Financial Services",
    location: "New York, NY",
    size: "1000+ employees",
    openPositions: 8,
  },
  {
    id: "3",
    name: "Green Solutions",
    logo: "",
    industry: "Renewable Energy",
    location: "Austin, TX",
    size: "100-500 employees",
    openPositions: 5,
  },
  {
    id: "4",
    name: "Health Innovations",
    logo: "",
    industry: "Healthcare Technology",
    location: "Boston, MA",
    size: "100-500 employees",
    openPositions: 7,
  },
  {
    id: "5",
    name: "Creative Digital",
    logo: "",
    industry: "Digital Marketing",
    location: "Chicago, IL",
    size: "50-100 employees",
    openPositions: 3,
  },
  {
    id: "6",
    name: "Data Insights",
    logo: "",
    industry: "Data Analytics",
    location: "Seattle, WA",
    size: "100-500 employees",
    openPositions: 9,
  },
];

const CompanyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCompanies = mockCompanies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search companies by name, industry, or location"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      
      {filteredCompanies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No companies found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
