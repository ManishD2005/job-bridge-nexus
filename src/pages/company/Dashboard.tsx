
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface JobApplication {
  id: string;
  job_title: string;
  applicant_name: string;
  status: string;
  applied_at: string;
}

const CompanyDashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [virtualBooths, setVirtualBooths] = useState<any[]>([]);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      // Fetch company ID first
      const { data: companyData } = await supabase
        .from('company_accounts')
        .select('company_id')
        .eq('id', supabase.auth.getUser().then(res => res.data.user?.id))
        .single();

      if (!companyData) {
        toast.error('Company account not found');
        return;
      }

      // Fetch applications
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          id, 
          status, 
          applied_at,
          jobs (title)
        `)
        .eq('jobs.company_id', companyData.company_id);

      // Fetch jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyData.company_id);

      // Fetch virtual booths
      const { data: boothsData } = await supabase
        .from('virtual_booth_sessions')
        .select('*')
        .eq('company_id', companyData.company_id);

      setApplications(applicationsData || []);
      setJobs(jobsData || []);
      setVirtualBooths(boothsData || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error('Failed to load company data');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>
      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="booths">Virtual Booths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.map(app => (
                <div key={app.id} className="border-b py-2">
                  <p>{app.jobs?.title}</p>
                  <p>Status: {app.status}</p>
                  <p>Applied At: {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Your Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.map(job => (
                <div key={job.id} className="border-b py-2">
                  <p>{job.title}</p>
                  <p>{job.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="booths">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Booths</CardTitle>
            </CardHeader>
            <CardContent>
              {virtualBooths.map(booth => (
                <div key={booth.id} className="border-b py-2">
                  <p>{booth.title}</p>
                  <p>{booth.description}</p>
                  <p>Scheduled: {new Date(booth.scheduled_date).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;
