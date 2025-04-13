
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import FeaturedCompanies from "@/components/Home/FeaturedCompanies";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of job seekers connecting with innovative companies on our platform.
            </p>
            <Link to="/jobs">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Browse All Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Featured Companies Section */}
        <FeaturedCompanies />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
