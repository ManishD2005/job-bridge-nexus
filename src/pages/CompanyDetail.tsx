
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Building, MapPin, Globe, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import JobCard, { JobProps } from "@/components/Jobs/JobCard";
import { toast } from "sonner";

interface CompanyDetails {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  location: string;
  website: string;
  industry: string;
}

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (companyError) {
        throw companyError;
      }

      setCompany(companyData);

      // Fetch company jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', id)
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (jobsError) {
        throw jobsError;
      }

      // Transform job data to match JobProps
      const formattedJobs: JobProps[] = jobsData.map(job => ({
        id: job.id,
        title: job.title,
        company: {
          id: companyData.id,
          name: companyData.name,
          logo: companyData.logo_url || ""
        },
        location: job.location || "Remote",
        type: job.job_type as any || "Full-time",
        salary: job.salary_range,
        postedDate: new Date(job.posted_date).toLocaleDateString(),
        description: job.description
      }));

      setJobs(formattedJobs);
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <p className="mb-6">The company you're looking for doesn't exist or has been removed.</p>
          <Link to="/companies">
            <Button>Browse All Companies</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-muted py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building className="h-12 w-12 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {company.industry && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{company.industry}</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">About {company.name}</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {company.description || `${company.name} is a company in the ${company.industry || 'technology'} industry.`}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
            
            {jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Open Positions</h3>
                  <p className="text-muted-foreground mb-6">
                    {company.name} doesn't have any open positions at the moment.
                  </p>
                  <Link to="/companies">
                    <Button variant="outline">Browse Other Companies</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetail;
