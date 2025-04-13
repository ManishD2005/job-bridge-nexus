
import { useState, ReactNode } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building, 
  BriefcaseBusiness, 
  Users, 
  Video,
  ChevronLeft,
  ChevronRight, 
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CompanyDashboardLayoutProps {
  children: ReactNode;
}

const CompanyDashboardLayout = ({ children }: CompanyDashboardLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside 
        className={`bg-card border-r h-screen flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className={`font-semibold text-lg ${collapsed ? "hidden" : "block"}`}>
            Company Portal
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            <li>
              <NavLink 
                to="/company/dashboard" 
                end
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                  ${collapsed ? "justify-center" : ""}`
                }
              >
                <Building size={20} />
                {!collapsed && <span className="ml-3">Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/company/jobs" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                  ${collapsed ? "justify-center" : ""}`
                }
              >
                <BriefcaseBusiness size={20} />
                {!collapsed && <span className="ml-3">Jobs</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/company/applications" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                  ${collapsed ? "justify-center" : ""}`
                }
              >
                <Users size={20} />
                {!collapsed && <span className="ml-3">Applications</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/company/virtual-booths" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                  ${collapsed ? "justify-center" : ""}`
                }
              >
                <Video size={20} />
                {!collapsed && <span className="ml-3">Virtual Booths</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className={`w-full ${collapsed ? "px-0" : ""}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboardLayout;
