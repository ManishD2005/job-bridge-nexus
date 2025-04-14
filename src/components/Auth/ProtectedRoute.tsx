
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  companyOnly?: boolean;
}

const ProtectedRoute = ({ children, companyOnly = false }: ProtectedRouteProps) => {
  const { user, isLoading, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        if (companyOnly) {
          navigate("/company/auth", { replace: true });
        } else {
          navigate("/auth", { replace: true });
        }
      } else if (companyOnly && userType !== 'company') {
        // If this route requires a company account but user isn't a company
        toast.error("This page is only accessible to company accounts");
        navigate("/", { replace: true });
      } else if (userType === 'company' && !location.pathname.startsWith('/company')) {
        // If company user tries to access jobseeker pages
        navigate("/company/dashboard", { replace: true });
      }
    }
  }, [user, isLoading, navigate, companyOnly, userType, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
