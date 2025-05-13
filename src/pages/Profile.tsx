
import { useState, useEffect } from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Briefcase, Clock, CheckCircle2, XCircle, AlertCircle, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ResumeUpload from "@/components/Profile/ResumeUpload";

interface Application {
  id: string;
  position: string;
  company: string;
  applied: string;
  status: string;
  interviewDate?: string;
}

interface SavedJob {
  id: string;
  job_id: string;
  position: string;
  company: string;
  postedDate: string;
}

const Profile = () => {
  const { user, profile } = useAuth();
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    location: "",
    about: "",
    resume_url: null as string | null,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  
  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        email: profile.email || user?.email || "",
        location: profile.location || "",
        about: profile.about || "",
        resume_url: profile.resume_url || null,
      });
    }
  }, [profile, user]);

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchSavedJobs();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          jobs (
            id,
            title,
            companies (
              name
            )
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const formattedApplications: Application[] = data.map(app => ({
        id: app.id,
        position: app.jobs.title,
        company: app.jobs.companies.name,
        applied: new Date(app.applied_at).toLocaleDateString(),
        status: app.status,
      }));
      
      setApplications(formattedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load your applications");
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          job_id,
          saved_at,
          jobs (
            id,
            title,
            posted_date,
            companies (
              name
            )
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const formattedSavedJobs: SavedJob[] = data.map(saved => ({
        id: saved.id,
        job_id: saved.job_id,
        position: saved.jobs.title,
        company: saved.jobs.companies.name,
        postedDate: new Date(saved.jobs.posted_date).toLocaleDateString(),
      }));
      
      setSavedJobs(formattedSavedJobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load your saved jobs");
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          location: profileData.location,
          about: profileData.about,
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      toast.error("This skill already exists");
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleResumeUploadComplete = (url: string | null) => {
    setProfileData(prev => ({
      ...prev,
      resume_url: url
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "interview":
        return <Badge className="bg-blue-500">Interview Scheduled</Badge>;
      case "reviewing":
        return <Badge variant="secondary">Under Review</Badge>;
      default:
        return <Badge variant="outline">Submitted</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "interview":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "reviewing":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleApplyToJob = (jobId: string) => {
    // Redirect to job application page
    window.location.href = `/jobs/${jobId}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-muted py-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src="" alt={profileData.full_name} />
                  <AvatarFallback className="text-2xl">{profileData.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold">{profileData.full_name || "Welcome!"}</h1>
                  <p className="text-muted-foreground text-lg">{profileData.location || user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-12">
            <Tabs defaultValue="profile">
              <TabsList className="mb-8">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>
                          Manage your personal details and contact information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={profileData.full_name} 
                              onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={profileData.email}
                              disabled 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="location">Location</Label>
                            <Input 
                              id="location" 
                              value={profileData.location} 
                              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                              placeholder="City, Country"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="about">About</Label>
                          <Textarea 
                            id="about" 
                            rows={4} 
                            value={profileData.about} 
                            onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                            placeholder="Write a short bio about yourself..."
                          />
                        </div>
                        <Button onClick={handleSaveProfile} disabled={isLoading}>
                          {isLoading ? (
                            <>Saving...</>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Resume / CV
                        </CardTitle>
                        <CardDescription>
                          Upload and manage your resume
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResumeUpload 
                          currentResumeUrl={profileData.resume_url} 
                          onUploadComplete={handleResumeUploadComplete} 
                        />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>
                          Add or remove your professional skills
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="py-1">
                              {skill}
                              <button 
                                className="ml-2 text-muted-foreground hover:text-foreground"
                                onClick={() => handleRemoveSkill(skill)}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                          {skills.length === 0 && (
                            <p className="text-sm text-muted-foreground">No skills added yet.</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Add a skill" 
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                          />
                          <Button variant="outline" onClick={handleAddSkill}>Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Your Applications
                    </CardTitle>
                    <CardDescription>
                      Track the status of your job applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <div key={app.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{app.position}</h3>
                                <p className="text-muted-foreground">{app.company}</p>
                              </div>
                              {getStatusBadge(app.status)}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>Applied on {app.applied}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(app.status)}
                                {app.status === "interview" && app.interviewDate && (
                                  <span className="text-sm font-medium">
                                    Interview: {new Date(app.interviewDate).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
                        <Button className="mt-4" onClick={() => window.location.href = "/jobs"}>
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Saved Jobs
                    </CardTitle>
                    <CardDescription>
                      Jobs you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {savedJobs.map((job) => (
                          <div key={job.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{job.position}</h3>
                                <p className="text-muted-foreground">{job.company}</p>
                              </div>
                              <Button size="sm" onClick={() => handleApplyToJob(job.job_id)}>
                                Apply
                              </Button>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              <span>Posted on {job.postedDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't saved any jobs yet.</p>
                        <Button className="mt-4" onClick={() => window.location.href = "/jobs"}>
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
