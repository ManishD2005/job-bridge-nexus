
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
        navigate("/auth", { replace: true });
      } else if (companyOnly && userType !== 'company') {
        // If this route requires a company account but user isn't a company
        toast.error("This page is only accessible to company accounts");
        navigate("/", { replace: true });
      }
    }
  }, [user, isLoading, navigate, companyOnly, userType]);

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
