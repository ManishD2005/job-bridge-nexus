import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard, { JobProps } from "./JobCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import { JobType } from "@/types/JobTypes";

const JobList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Unique job types and locations for filters
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(id, name, logo_url)
        `)
        .order('posted_date', { ascending: false });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      if (!data) {
        console.error('No data returned from Supabase');
        throw new Error('No data returned from database');
      }

      // Transform the data to match our JobProps structure
      const formattedJobs = data.map(job => ({
        id: job.id,
        title: job.title,
        company: {
          id: job.company.id,
          name: job.company.name,
          logo: job.company.logo_url || ""
        },
        location: job.location || "Remote",
        type: job.job_type as JobType || "Full-time",
        salary: job.salary_range,
        postedDate: new Date(job.posted_date).toLocaleDateString(),
        description: job.description
      }));

      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
      
      // Extract unique job types and locations for filters
      const types = Array.from(new Set(formattedJobs.map(job => job.type))).filter(Boolean);
      const locs = Array.from(new Set(formattedJobs.map(job => job.location))).filter(Boolean);
      
      setJobTypes(types as string[]);
      setLocations(locs as string[]);
      
    } catch (error) {
      console.error('Full error object:', error);
      const pgError = error as PostgrestError;
      toast.error(`Error fetching jobs: ${pgError.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let result = jobs;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply job type filter
    if (filterType !== "all") {
      result = result.filter(job => job.type === filterType);
    }
    
    // Apply location filter
    if (filterLocation !== "all") {
      result = result.filter(job => job.location === filterLocation);
    }
    
    setFilteredJobs(result);
  }, [searchTerm, filterType, filterLocation, jobs]);

  return (
    <div>
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search jobs by title, company or keywords"
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Types</SelectItem>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/2">
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Jobs list */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No jobs found matching your search criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm("");
                setFilterType("all");
                setFilterLocation("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;
