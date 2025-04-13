
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Briefcase className="h-6 w-6 text-primary" />
            <span>JobBridge</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/companies" className="font-medium hover:text-primary transition-colors">
              Companies
            </Link>
            <Link to="/jobs" className="font-medium hover:text-primary transition-colors">
              Jobs
            </Link>
            <Link to="/profile" className="font-medium hover:text-primary transition-colors">
              Profile
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </div>
            <button className="md:hidden" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2 border-t pt-3">
            <Link 
              to="/" 
              className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/companies" 
              className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </Link>
            <Link 
              to="/jobs" 
              className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link 
              to="/profile" 
              className="block py-2 px-3 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <div className="pt-2">
              <Button variant="default" className="w-full">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
