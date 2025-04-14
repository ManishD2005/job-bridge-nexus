
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userType } = useAuth();
  const location = useLocation();
  
  // Different nav links for company users vs job seekers
  const jobSeekerLinks = [
    { name: "Home", path: "/" },
    { name: "Companies", path: "/companies" },
    { name: "Jobs", path: "/jobs" },
    { name: "Virtual Booth", path: "/virtual-booth" },
  ];
  
  const companyLinks = [
    { name: "Dashboard", path: "/company/dashboard" },
    { name: "Companies", path: "/companies" },
    { name: "Jobs", path: "/jobs" },
  ];
  
  // Use appropriate links based on user type
  const navLinks = userType === 'company' ? companyLinks : jobSeekerLinks;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl flex items-center">
          <span className="text-primary mr-1">Career</span>Connect
          {userType === 'company' && (
            <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              Company
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm">Profile</Button>
              </Link>
              {userType === 'company' && (
                <Link to="/company/dashboard">
                  <Button variant="outline" size="sm">
                    <Building2 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline">Job Seeker Sign In</Button>
              </Link>
              <Link to="/company/auth">
                <Button>Company Sign In</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base font-medium transition-colors hover:text-primary ${
                      isActive(link.path) ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="border-t my-4 pt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">Profile</Button>
                      </Link>
                      {userType === 'company' && (
                        <Link to="/company/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <Building2 className="mr-2 h-4 w-4" />
                            Company Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Job Seeker Sign In</Button>
                      </Link>
                      <Link to="/company/auth" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full">Company Sign In</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
