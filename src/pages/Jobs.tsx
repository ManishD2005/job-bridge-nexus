
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import JobList from "@/components/Jobs/JobList";

const Jobs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Job Board</h1>
            <p className="text-muted-foreground text-lg">
              Find your next career opportunity from our curated job listings
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <JobList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
