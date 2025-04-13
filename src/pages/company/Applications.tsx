
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CompanyDashboardLayout from "@/components/Company/CompanyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const ApplicationStatusOptions = [
  { value: "submitted", label: "Submitted", variant: "default" },
  { value: "reviewing", label: "Reviewing", variant: "warning" },
  { value: "interviewed", label: "Interviewed", variant: "info" },
  { value: "accepted", label: "Accepted", variant: "success" },
  { value: "rejected", label: "Rejected", variant: "destructive" }
];

const CompanyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

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
        fetchApplications(data.company_id);
      } catch (error: any) {
        console.error("Error fetching company ID:", error);
        toast.error("Failed to load company information");
      }
    };
    
    fetchCompanyId();
  }, [user]);

  const fetchApplications = async (companyId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          job:jobs!inner(id, title, company_id),
          profile:profiles!inner(id, full_name, email)
        `)
        .eq("job.company_id", companyId)
        .order("applied_at", { ascending: false });
        
      if (error) throw error;
      
      setApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", applicationId);
        
      if (error) throw error;
      
      // Update the local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
      
      toast.success(`Application status updated to ${status}`);
    } catch (error: any) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const downloadResume = (resumeUrl: string, applicantName: string) => {
    if (!resumeUrl) {
      toast.error("No resume available for download");
      return;
    }
    
    // In a real implementation, you would generate a download URL from Supabase Storage
    // For this demo, we're using a placeholder message
    toast.info("In a production environment, this would download the applicant's resume");
  };

  const filteredApplications = applications
    .filter(app => 
      !statusFilter || app.status === statusFilter
    )
    .filter(app => 
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profile.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadgeVariant = (status: string) => {
    const option = ApplicationStatusOptions.find(opt => opt.value === status);
    return option?.variant || "default";
  };

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Manage candidate applications for your job postings
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>All Applications</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select 
                  value={statusFilter || ""} 
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {ApplicationStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No applications have been received yet.</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No applications match your search or filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.profile.full_name}</div>
                          <div className="text-sm text-muted-foreground">{application.profile.email}</div>
                        </TableCell>
                        <TableCell>
                          <Link to={`/jobs/${application.job.id}`} className="hover:underline">
                            {application.job.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {format(new Date(application.applied_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={application.status}
                            onValueChange={(value) => updateApplicationStatus(application.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue>
                                <Badge variant={getStatusBadgeVariant(application.status)}>
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {ApplicationStatusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <Badge variant={option.variant} className="mr-2">
                                    {option.label}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {application.resume_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadResume(application.resume_url, application.profile.full_name)}
                              >
                                <Download className="h-4 w-4 mr-1" /> Resume
                              </Button>
                            )}
                            {application.cover_letter && (
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" /> Cover Letter
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View Details
                          </Button>
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

export default CompanyApplications;
