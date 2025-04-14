
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
      // Fetch current user session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Fetch company ID for the current user
      const { data: companyData, error: companyError } = await supabase
        .from('company_accounts')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (companyError || !companyData) {
        toast.error('Company account not found');
        console.error('Error fetching company data:', companyError);
        return;
      }

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          id, 
          status, 
          applied_at,
          jobs (id, title)
        `)
        .eq('jobs.company_id', companyData.company_id);

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
      }

      // Transform applications data to match JobApplication interface
      const formattedApplications = (applicationsData || []).map(app => ({
        id: app.id,
        job_title: app.jobs?.title || 'Unknown Job',
        applicant_name: 'Applicant', // We would need to fetch this from profiles table
        status: app.status,
        applied_at: app.applied_at
      }));

      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyData.company_id);

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
      }

      // Fetch virtual booths
      const { data: boothsData, error: boothsError } = await supabase
        .from('virtual_booth_sessions')
        .select('*')
        .eq('company_id', companyData.company_id);

      if (boothsError) {
        console.error('Error fetching booths:', boothsError);
      }

      setApplications(formattedApplications);
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
              {applications.length > 0 ? (
                applications.map(app => (
                  <div key={app.id} className="border-b py-2">
                    <p>{app.job_title}</p>
                    <p>Status: {app.status}</p>
                    <p>Applied At: {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>No applications found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Your Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <div key={job.id} className="border-b py-2">
                    <p>{job.title}</p>
                    <p>{job.description}</p>
                  </div>
                ))
              ) : (
                <p>No jobs found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="booths">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Booths</CardTitle>
            </CardHeader>
            <CardContent>
              {virtualBooths.length > 0 ? (
                virtualBooths.map(booth => (
                  <div key={booth.id} className="border-b py-2">
                    <p>{booth.title}</p>
                    <p>{booth.description}</p>
                    <p>Scheduled: {new Date(booth.scheduled_date).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>No virtual booths found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;
