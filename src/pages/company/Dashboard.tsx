
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CompanyDashboardLayout from "@/components/Company/CompanyDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Video, Clock } from "lucide-react";
import { toast } from "sonner";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState<any>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    upcomingBooths: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // First, get the company account to find the company ID
        const { data: accountData, error: accountError } = await supabase
          .from("company_accounts")
          .select("company_id")
          .eq("id", user.id)
          .single();
          
        if (accountError) throw accountError;
        
        const companyId = accountData.company_id;
        
        // Get the company details
        const { data: companyDetails, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .single();
          
        if (companyError) throw companyError;
        
        setCompanyData(companyDetails);
        
        // Get job count
        const { count: jobCount, error: jobError } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("company_id", companyId)
          .eq("is_active", true);
          
        if (jobError) throw jobError;
        
        // Get application count
        const { count: applicationCount, error: applicationError } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .in("job_id", supabase.from("jobs").select("id").eq("company_id", companyId));
          
        if (applicationError) throw applicationError;
        
        // Get upcoming booth count
        const { count: boothCount, error: boothError } = await supabase
          .from("virtual_booth_sessions")
          .select("*", { count: "exact", head: true })
          .eq("company_id", companyId)
          .eq("is_active", true)
          .gte("scheduled_date", new Date().toISOString());
          
        if (boothError) throw boothError;
        
        setStats({
          activeJobs: jobCount || 0,
          totalApplications: applicationCount || 0,
          upcomingBooths: boothCount || 0
        });
      } catch (error: any) {
        console.error("Error fetching company data:", error);
        toast.error("Failed to load company dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [user]);

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {companyData?.name} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to your company dashboard. Manage your jobs, applications, and virtual booths.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/company/jobs/create">
              <Button>
                Post New Job
              </Button>
            </Link>
            <Link to="/company/virtual-booths/create">
              <Button variant="outline">
                Create Virtual Booth
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Job Listings
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeJobs === 0 ? "No active jobs" : stats.activeJobs === 1 ? "1 active job" : `${stats.activeJobs} active jobs`}
              </p>
              <Link to="/company/jobs" className="text-primary text-sm mt-4 inline-block">
                View all jobs
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalApplications === 0 ? "No applications yet" : stats.totalApplications === 1 ? "1 application received" : `${stats.totalApplications} applications received`}
              </p>
              <Link to="/company/applications" className="text-primary text-sm mt-4 inline-block">
                View all applications
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Virtual Booths
              </CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBooths}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.upcomingBooths === 0 ? "No upcoming virtual booths" : stats.upcomingBooths === 1 ? "1 upcoming virtual booth" : `${stats.upcomingBooths} upcoming virtual booths`}
              </p>
              <Link to="/company/virtual-booths" className="text-primary text-sm mt-4 inline-block">
                Manage virtual booths
              </Link>
            </CardContent>
          </Card>
        </div>
        
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Your company profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h3>
                <p>{companyData?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Industry</h3>
                <p>{companyData?.industry || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                <p>{companyData?.location || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                <p>
                  {companyData?.website ? (
                    <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {companyData.website}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm">{companyData?.description || "No description provided"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CompanyDashboardLayout>
  );
};

export default CompanyDashboard;
