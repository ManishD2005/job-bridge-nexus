
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Company Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your company account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleCompanyLogin}>
          <CardContent className="space-y-4">
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
            
            <div className="pt-4 text-sm text-muted-foreground">
              <p>For company access, please contact us at support@careerconnect.com</p>
              <p className="mt-2">Demo company accounts:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>technova@example.com</li>
                <li>ecosolutions@example.com</li>
                <li>financewave@example.com</li>
              </ul>
              <p className="mt-2">Password for all demo accounts: <strong>Company123!</strong></p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyAuth;
