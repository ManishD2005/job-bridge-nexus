
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
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
        
        {/* Recent Companies Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Companies</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These companies are actively recruiting on our platform
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 flex justify-center items-center h-24 border">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">C{i}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/companies">
                <Button variant="outline">
                  View All Companies <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
