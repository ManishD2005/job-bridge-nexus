
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CompanyLogo1 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="#9b87f5" />
    <text x="50" y="60" fontFamily="Arial" fontSize="30" fill="white" textAnchor="middle">TI</text>
  </svg>
);

const CompanyLogo2 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="80" height="80" rx="10" fill="#F97316" />
    <text x="50" y="60" fontFamily="Arial" fontSize="30" fill="white" textAnchor="middle">CD</text>
  </svg>
);

const CompanyLogo3 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,10 90,90 10,90" fill="#0EA5E9" />
    <text x="50" y="70" fontFamily="Arial" fontSize="24" fill="white" textAnchor="middle">GF</text>
  </svg>
);

const CompanyLogo4 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="80" height="80" rx="40" fill="#D946EF" />
    <text x="50" y="60" fontFamily="Arial" fontSize="30" fill="white" textAnchor="middle">DI</text>
  </svg>
);

const FeaturedCompanies = () => {
  const companies = [
    { id: 1, name: "TechInnovate", Logo: CompanyLogo1 },
    { id: 2, name: "Creative Digital", Logo: CompanyLogo2 },
    { id: 3, name: "Global Finance", Logo: CompanyLogo3 },
    { id: 4, name: "Data Insights", Logo: CompanyLogo4 },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Companies</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These companies are actively recruiting on our platform
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {companies.map((company) => (
            <div key={company.id} className="bg-card rounded-lg p-6 flex flex-col items-center justify-center h-32 border hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mb-2">
                <company.Logo />
              </div>
              <span className="text-sm font-medium">{company.name}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/companies">
            <Button variant="outline">
              View All Companies <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
