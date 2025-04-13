
import { useState } from "react";
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
import { User, FileText, Briefcase, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// Mock application data
const applications = [
  {
    id: "1",
    position: "Senior Frontend Developer",
    company: "TechInnovate",
    applied: "2023-04-05",
    status: "interview",
    interviewDate: "2023-04-15T10:00:00",
  },
  {
    id: "2",
    position: "UX Designer",
    company: "Creative Digital",
    applied: "2023-04-02",
    status: "rejected",
  },
  {
    id: "3",
    position: "Product Manager",
    company: "Global Finance",
    applied: "2023-04-01",
    status: "reviewing",
  },
  {
    id: "4",
    position: "Data Analyst",
    company: "Data Insights",
    applied: "2023-03-28",
    status: "accepted",
  },
];

// Mock saved jobs
const savedJobs = [
  {
    id: "5",
    position: "Backend Developer",
    company: "TechInnovate",
    postedDate: "2023-04-01",
  },
  {
    id: "6",
    position: "Marketing Specialist",
    company: "Creative Digital",
    postedDate: "2023-03-30",
  },
];

const Profile = () => {
  const [user] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    about: "Experienced software developer with a passion for creating intuitive user experiences and solving complex problems.",
    skills: ["React", "TypeScript", "Node.js", "UI/UX Design", "Project Management"],
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground text-lg">{user.location}</p>
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
                          <Input id="name" value={user.name} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={user.email} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" value={user.phone} />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" value={user.location} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="about">About</Label>
                        <Textarea id="about" rows={4} value={user.about} />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Resume / CV
                      </CardTitle>
                      <CardDescription>
                        Upload and manage your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-dashed rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="mb-2">Drag and drop your resume here, or click to browse</p>
                        <p className="text-sm text-muted-foreground mb-4">PDF, DOCX or RTF up to 5MB</p>
                        <Button variant="outline">Upload Resume</Button>
                      </div>
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
                        {user.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Add a skill" />
                        <Button variant="outline">Add</Button>
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
                            <span>Applied on {new Date(app.applied).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(app.status)}
                            {app.status === "interview" && (
                              <span className="text-sm font-medium">
                                Interview: {new Date(app.interviewDate).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{job.position}</h3>
                            <p className="text-muted-foreground">{job.company}</p>
                          </div>
                          <Button size="sm">Apply</Button>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
