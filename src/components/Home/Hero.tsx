
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-30 z-0"></div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Virtual Career Fair Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in">
            Connect with leading companies and find your dream job from anywhere in the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/companies">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Companies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
