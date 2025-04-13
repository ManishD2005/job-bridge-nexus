
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Mail, Lock, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompanyAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    companyName: "",
    companyId: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  // Fetch existing companies
  useState(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoadingCompanies(true);
        const { data, error } = await supabase
          .from("companies")
          .select("id, name");

        if (error) throw error;
        setCompanies(data || []);
      } catch (error: any) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies");
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        throw error;
      }

      // Check if user is associated with a company
      const { data: companyAccount, error: companyError } = await supabase
        .from("company_accounts")
        .select("company_id")
        .eq("id", data.user?.id)
        .single();

      if (companyError && companyError.code !== "PGRST116") {
        throw companyError;
      }

      if (companyAccount) {
        toast.success("Login successful!");
        navigate("/company/dashboard");
      } else {
        // Not a company account, show error
        await supabase.auth.signOut();
        toast.error("This is not a company account.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupData.companyId || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      
      // Register company user with metadata
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            user_type: "company",
            company_id: signupData.companyId,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      
      // Auto-login after signup
      if (data?.user) {
        navigate("/company/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Company Portal</CardTitle>
          <CardDescription>
            Log in or sign up as a company to manage your jobs, applications, and virtual booths
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="company-login-email"
                  type="email"
                  placeholder="company@example.com"
                  className="pl-10"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="company-login-password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login as Company"}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or Register
              </span>
            </div>
          </div>
          
          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-select">Select Your Company</Label>
              <Select 
                value={signupData.companyId} 
                onValueChange={(value) => {
                  const selectedCompany = companies.find(c => c.id === value);
                  setSignupData({
                    ...signupData, 
                    companyId: value,
                    companyName: selectedCompany?.name || ""
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Can't find your company? Contact support to add your company to the platform.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-signup-email">Company Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="company-signup-email"
                  type="email"
                  placeholder="company@example.com"
                  className="pl-10"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="company-signup-password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-signup-confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="company-signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register as Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyAuth;
