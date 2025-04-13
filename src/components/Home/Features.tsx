
import { Briefcase, Users, Calendar, Award, Globe, Search } from "lucide-react";

const features = [
  {
    title: "Virtual Company Booths",
    description: "Explore company profiles and browse their open positions from anywhere.",
    icon: Briefcase,
  },
  {
    title: "Connect with Recruiters",
    description: "Schedule virtual interviews and connect directly with company representatives.",
    icon: Users,
  },
  {
    title: "Organized Events",
    description: "Join scheduled career fairs with multiple companies in your industry.",
    icon: Calendar,
  },
  {
    title: "Showcase Your Skills",
    description: "Create a comprehensive profile highlighting your experiences and skills.",
    icon: Award,
  },
  {
    title: "Global Opportunities",
    description: "Access job opportunities from companies around the world.",
    icon: Globe,
  },
  {
    title: "Smart Job Matching",
    description: "Find positions that match your skills and career goals.",
    icon: Search,
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose JobBridge?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform offers everything you need to connect with top companies and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
