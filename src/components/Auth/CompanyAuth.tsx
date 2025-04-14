
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CompanyAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Check if the user is a company user
      const { data: companyAccount } = await supabase
        .from('company_accounts')
        .select('company_id')
        .eq('id', data.user?.id)
        .single();

      if (companyAccount) {
        toast.success('Successfully logged in');
        navigate('/company/dashboard');
      } else {
        toast.error('Not a company account');
        await supabase.auth.signOut();
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleCompanyLogin} className="space-y-4">
        <Input 
          type="email" 
          placeholder="Company Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default CompanyAuth;
