
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { JobProps } from "@/components/Jobs/JobCard";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building, Briefcase, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<JobProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user) {
      checkApplicationStatus();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          location,
          job_type,
          salary_range,
          posted_date,
          company:companies (
            id,
            name,
            logo_url,
            description,
            location,
            website
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      // Transform to match JobProps
      const formattedJob: JobProps = {
        id: data.id,
        title: data.title,
        company: {
          id: data.company.id,
          name: data.company.name,
          logo: data.company.logo_url || ""
        },
        location: data.location || "Remote",
        type: data.job_type as any || "Full-time",
        salary: data.salary_range,
        postedDate: new Date(data.posted_date).toLocaleDateString(),
        description: data.description
      };

      setJob(formattedJob);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setHasApplied(!!data);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Please sign in to apply for this job");
      navigate("/auth", { state: { redirectUrl: `/jobs/${id}` } });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: id,
          user_id: user.id,
          cover_letter: coverLetter,
        });

      if (error) {
        throw error;
      }

      toast.success("Application submitted successfully!");
      setHasApplied(true);
      setCoverLetter("");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/jobs")}>Browse All Jobs</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                    {job.company.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="text-base mt-1">{job.company.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {job.type}
                  </Badge>
                  {job.salary && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {job.salary}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Posted {job.postedDate}
                  </Badge>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                  <div className="prose max-w-none text-muted-foreground whitespace-pre-line">
                    {job.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>
                  Share why you're a great fit for this role
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasApplied ? (
                  <div className="text-center py-4">
                    <div className="mb-4 text-primary">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">Application Submitted</h3>
                    <p className="text-muted-foreground mt-1">
                      You've already applied for this position
                    </p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                      className="min-h-[200px] mb-4"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      disabled={isSubmitting || !user}
                    />
                    <div className="text-xs text-muted-foreground mb-4">
                      Your profile information will be included with your application.
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {hasApplied ? (
                  <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
                    View Your Applications
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleApply}
                    disabled={isSubmitting || !user || !coverLetter.trim()}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
