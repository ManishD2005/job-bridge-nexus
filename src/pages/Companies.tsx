
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import CompanyList from "@/components/Companies/CompanyList";

const Companies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Company Directory</h1>
            <p className="text-muted-foreground text-lg">
              Browse and connect with companies that are actively recruiting
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <CompanyList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companies;
