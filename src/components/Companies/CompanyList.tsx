
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CompanyCard, { CompanyProps } from "./CompanyCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

const CompanyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState<CompanyProps[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      
      // First get all companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) {
        throw companiesError;
      }

      // Then get job counts for each company
      const companyIds = companiesData.map(company => company.id);
      
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('company_id, id')
        .in('company_id', companyIds);

      if (jobsError) {
        throw jobsError;
      }

      // Count jobs per company
      const jobCounts: Record<string, number> = {};
      jobsData.forEach(job => {
        jobCounts[job.company_id] = (jobCounts[job.company_id] || 0) + 1;
      });

      // Format the data to match our CompanyProps structure
      const formattedCompanies: CompanyProps[] = companiesData.map(company => ({
        id: company.id,
        name: company.name,
        logo: company.logo_url || "",
        industry: company.industry || "Technology",
        location: company.location || "Remote",
        size: "Not specified",
        openPositions: jobCounts[company.id] || 0
      }));

      setCompanies(formattedCompanies);
      setFilteredCompanies(formattedCompanies);
      
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(`Error fetching companies: ${pgError.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

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
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Companies list */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No companies found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyList;
