
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface JobApplication {
  id: string;
  job_title: string;
  applicant_name: string;
  status: string;
  applied_at: string;
}

interface Company {
  id: string;
  name: string;
  hires_count?: number;
  satisfaction_score?: number;
}

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [virtualBooths, setVirtualBooths] = useState<any[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Job form state
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salary_range: '',
    job_type: 'Full-time',
    experience_level: 'Entry-level'
  });
  
  // Booth form state
  const [newBooth, setNewBooth] = useState({
    title: '',
    description: '',
    meet_link: '',
    scheduled_date: '',
    duration_minutes: 30,
    max_participants: 10
  });

  useEffect(() => {
    if (user) {
      fetchCompanyId();
    }
  }, [user]);

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
      fetchLeaderboard();
    }
  }, [companyId]);

  const fetchCompanyId = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('company_accounts')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching company ID:', error);
        return;
      }
      
      if (data) {
        setCompanyId(data.company_id);
      }
    } catch (error) {
      console.error('Error in fetchCompanyId:', error);
    }
  };

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      if (!companyId) return;

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          id, 
          status, 
          applied_at,
          jobs!inner (
            id,
            title
          ),
          profiles:user_id (
            full_name
          )
        `)
        .eq('jobs.company_id', companyId);

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
      } else if (applicationsData) {
        // Transform applications data to match JobApplication interface
        const formattedApplications = applicationsData.map(app => ({
          id: app.id,
          job_title: app.jobs?.title || 'Unknown Job',
          applicant_name: app.profiles?.full_name || 'Unknown Applicant',
          status: app.status,
          applied_at: new Date(app.applied_at).toLocaleDateString()
        }));
        setApplications(formattedApplications);
      }

      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyId);

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
      } else {
        setJobs(jobsData || []);
      }

      // Fetch virtual booths
      const { data: boothsData, error: boothsError } = await supabase
        .from('virtual_booth_sessions')
        .select(`
          *,
          booth_participants (
            id,
            status,
            user_id,
            profiles:user_id (
              full_name
            )
          )
        `)
        .eq('company_id', companyId);

      if (boothsError) {
        console.error('Error fetching booths:', boothsError);
      } else {
        setVirtualBooths(boothsData || []);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error('Failed to load company data');
      setIsLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // In a real application, this would query a table with company metrics
      // For this example, we'll create a simulated leaderboard from companies table
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }
      
      // Add simulated metrics for demonstration
      if (data) {
        const companiesWithMetrics = data.map((company, index) => ({
          ...company,
          hires_count: Math.floor(Math.random() * 50) + 10,
          satisfaction_score: Math.floor(Math.random() * 40) + 60
        }));
        
        // Sort by our simulated metrics
        const sortedCompanies = companiesWithMetrics.sort((a, b) => 
          (b.satisfaction_score || 0) - (a.satisfaction_score || 0)
        );
        
        setTopCompanies(sortedCompanies);
      }
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
    }
  };

  const handleCreateJob = async () => {
    try {
      if (!companyId) {
        toast.error('Company ID not found');
        return;
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...newJob,
          company_id: companyId
        })
        .select();
      
      if (error) throw error;
      
      toast.success('Job created successfully');
      fetchCompanyData();
      
      // Reset form
      setNewJob({
        title: '',
        description: '',
        location: '',
        salary_range: '',
        job_type: 'Full-time',
        experience_level: 'Entry-level'
      });
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create job');
      console.error(error);
    }
  };

  const handleCreateBooth = async () => {
    try {
      if (!companyId) {
        toast.error('Company ID not found');
        return;
      }
      
      const scheduledDate = new Date(newBooth.scheduled_date);
      
      if (isNaN(scheduledDate.getTime())) {
        toast.error('Please enter a valid date and time');
        return;
      }
      
      const { data, error } = await supabase
        .from('virtual_booth_sessions')
        .insert({
          ...newBooth,
          company_id: companyId
        })
        .select();
      
      if (error) throw error;
      
      toast.success('Virtual booth created successfully');
      fetchCompanyData();
      
      // Reset form
      setNewBooth({
        title: '',
        description: '',
        meet_link: '',
        scheduled_date: '',
        duration_minutes: 30,
        max_participants: 10
      });
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create virtual booth');
      console.error(error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      toast.success(`Application status updated to ${newStatus}`);
      fetchCompanyData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update application status');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>
      
      {/* Leaderboard Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recruiter Leaderboard</CardTitle>
          <CardDescription>Top companies by employee satisfaction and hiring rate</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Employee Satisfaction</TableHead>
                <TableHead>Monthly Hires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCompanies.map((company, index) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.satisfaction_score}%</TableCell>
                  <TableCell>{company.hires_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="applications">
        <TabsList className="mb-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
          <TabsTrigger value="booths">Virtual Booths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell>{app.job_title}</TableCell>
                        <TableCell>{app.applicant_name}</TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={app.status} 
                            onValueChange={(value) => handleUpdateApplicationStatus(app.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder={app.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="interviewing">Interviewing</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{app.applied_at}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No applications found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Jobs</CardTitle>
                <CardDescription>Manage your job postings</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Post New Job</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Job Posting</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new job posting
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input 
                        id="title" 
                        value={newJob.title} 
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newJob.description} 
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={newJob.location} 
                        onChange={(e) => setNewJob({...newJob, location: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input 
                        id="salary" 
                        value={newJob.salary_range} 
                        onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="job_type">Job Type</Label>
                        <Select 
                          value={newJob.job_type} 
                          onValueChange={(value) => setNewJob({...newJob, job_type: value})}
                        >
                          <SelectTrigger id="job_type">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select 
                          value={newJob.experience_level} 
                          onValueChange={(value) => setNewJob({...newJob, experience_level: value})}
                        >
                          <SelectTrigger id="experience">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Entry-level">Entry-level</SelectItem>
                            <SelectItem value="Mid-level">Mid-level</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateJob}>Post Job</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription>{job.location} • {job.job_type}</CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3">{job.description}</p>
                        <div className="flex mt-2 gap-2">
                          {job.salary_range && (
                            <span className="bg-muted text-xs px-2 py-1 rounded-full">
                              {job.salary_range}
                            </span>
                          )}
                          {job.experience_level && (
                            <span className="bg-muted text-xs px-2 py-1 rounded-full">
                              {job.experience_level}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><PlusCircle className="mr-2 h-4 w-4" /> Post Your First Job</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      {/* Same dialog content as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="booths">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Virtual Booths</CardTitle>
                <CardDescription>Schedule virtual recruitment sessions</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Booth</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Virtual Booth</DialogTitle>
                    <DialogDescription>
                      Schedule a new virtual recruitment session
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="booth_title">Title</Label>
                      <Input 
                        id="booth_title" 
                        value={newBooth.title} 
                        onChange={(e) => setNewBooth({...newBooth, title: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="booth_description">Description</Label>
                      <Textarea 
                        id="booth_description" 
                        value={newBooth.description} 
                        onChange={(e) => setNewBooth({...newBooth, description: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meet_link">Meeting Link (Google Meet, Zoom, etc.)</Label>
                      <Input 
                        id="meet_link" 
                        value={newBooth.meet_link} 
                        onChange={(e) => setNewBooth({...newBooth, meet_link: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="scheduled_date">Date and Time</Label>
                      <Input 
                        id="scheduled_date" 
                        type="datetime-local"
                        value={newBooth.scheduled_date} 
                        onChange={(e) => setNewBooth({...newBooth, scheduled_date: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input 
                          id="duration" 
                          type="number"
                          value={newBooth.duration_minutes.toString()} 
                          onChange={(e) => setNewBooth({...newBooth, duration_minutes: parseInt(e.target.value) || 30})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="max_participants">Max Participants</Label>
                        <Input 
                          id="max_participants" 
                          type="number"
                          value={newBooth.max_participants.toString()} 
                          onChange={(e) => setNewBooth({...newBooth, max_participants: parseInt(e.target.value) || 10})} 
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateBooth}>Create Booth</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {virtualBooths.length > 0 ? (
                <div className="space-y-4">
                  {virtualBooths.map(booth => (
                    <Card key={booth.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{booth.title}</CardTitle>
                            <CardDescription>
                              {new Date(booth.scheduled_date).toLocaleString()} • {booth.duration_minutes} min
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{booth.description}</p>
                        <div className="mb-4">
                          <p className="text-sm font-medium">Meeting Link:</p>
                          <a 
                            href={booth.meet_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {booth.meet_link}
                          </a>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Participants in Queue</h4>
                          {booth.booth_participants && booth.booth_participants.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {booth.booth_participants.map((participant: any) => (
                                  <TableRow key={participant.id}>
                                    <TableCell>{participant.profiles?.full_name || 'Unknown'}</TableCell>
                                    <TableCell>{participant.status}</TableCell>
                                    <TableCell>
                                      <Button variant="outline" size="sm">Invite to Meeting</Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p className="text-muted-foreground text-sm">No participants in queue</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No virtual booths scheduled</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><PlusCircle className="mr-2 h-4 w-4" /> Schedule Your First Booth</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      {/* Same dialog content as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;
