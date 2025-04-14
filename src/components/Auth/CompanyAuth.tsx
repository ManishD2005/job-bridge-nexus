
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react';

const CompanyAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Check if the user is a company user
      const { data: userType, error: typeError } = await supabase
        .rpc('get_user_type', { user_id: data.user?.id });

      if (typeError) throw typeError;

      if (userType === 'company') {
        toast.success('Successfully logged in as company');
        navigate('/company/dashboard');
      } else {
        toast.error('Not a company account');
        await supabase.auth.signOut();
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !companyName || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: 'company',
            company_name: companyName
          }
        }
      });

      if (error) throw error;
      
      toast.success("Registration successful! Please check your email to verify your account.");
      navigate('/company/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? 'Company Login' : 'Register Company'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your credentials to access your company account' 
              : 'Create a new company account to start recruiting'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={isLogin ? handleCompanyLogin : handleCompanySignup}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Acme Inc."
                      className="pl-10"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="company@example.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (isLogin ? "Logging in..." : "Creating account...") 
                : (isLogin ? "Login" : "Create account")}
            </Button>
            
            <p className="text-center text-sm">
              {isLogin ? "Don't have a company account?" : "Already have a company account?"}
              <button 
                type="button" 
                className="ml-1 text-primary hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyAuth;
