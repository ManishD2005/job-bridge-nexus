
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CompanyDashboardLayout from "@/components/Company/CompanyDashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const CompanyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("company_accounts")
          .select("company_id")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        setCompanyId(data.company_id);
        fetchJobs(data.company_id);
      } catch (error: any) {
        console.error("Error fetching company ID:", error);
        toast.error("Failed to load company information");
      }
    };
    
    fetchCompanyId();
  }, [user]);

  const fetchJobs = async (companyId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          applications:applications(count)
        `)
        .eq("company_id", companyId)
        .order("posted_date", { ascending: false });
        
      if (error) throw error;
      
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job listings");
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_active: !currentStatus })
        .eq("id", jobId);
        
      if (error) throw error;
      
      // Update the local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, is_active: !currentStatus } : job
      ));
      
      toast.success(`Job ${!currentStatus ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling job status:", error);
      toast.error("Failed to update job status");
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);
        
      if (error) throw error;
      
      // Update the local state
      setJobs(jobs.filter(job => job.id !== jobId));
      
      toast.success("Job deleted successfully");
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.job_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Job Listings</h1>
            <p className="text-muted-foreground">
              Manage your company's job postings
            </p>
          </div>
          <Link to="/company/jobs/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>Your Jobs</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
                <Link to="/company/jobs/create">
                  <Button variant="link" className="mt-2">
                    Post your first job
                  </Button>
                </Link>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No jobs match your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Posted On</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <div>
                            {job.title}
                            <div className="flex items-center gap-2 mt-1">
                              {job.location && (
                                <Badge variant="outline" className="text-xs">
                                  {job.location}
                                </Badge>
                              )}
                              {job.job_type && (
                                <Badge variant="secondary" className="text-xs">
                                  {job.job_type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{job.applications?.[0]?.count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(job.posted_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {job.expires_at 
                            ? format(new Date(job.expires_at), "MMM d, yyyy")
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={job.is_active ? "success" : "destructive"}>
                            {job.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/jobs/${job.id}`}>
                              <Button variant="ghost" size="icon">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleJobStatus(job.id, job.is_active)}
                            >
                              <Badge variant={job.is_active ? "destructive" : "success"} className="h-4 px-2 text-[10px]">
                                {job.is_active ? "Disable" : "Enable"}
                              </Badge>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CompanyDashboardLayout>
  );
};

export default CompanyJobs;
