
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SaveJobButtonProps {
  jobId: string;
}

const SaveJobButton = ({ jobId }: SaveJobButtonProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSaveJob = async () => {
    if (!user) {
      toast.error("Please sign in to save jobs", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Check if already saved
      const { data: existingData, error: checkError } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingData) {
        // Already saved, so unsave it
        const { error: deleteError } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('id', existingData.id);
        
        if (deleteError) throw deleteError;
        
        toast.success("Job removed from saved list");
      } else {
        // Not saved yet, so save it
        const { error: saveError } = await supabase
          .from('saved_jobs')
          .insert([
            { job_id: jobId, user_id: user.id }
          ]);
        
        if (saveError) throw saveError;
        
        toast.success("Job saved successfully");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Save job"
      disabled={isSaving}
      onClick={handleSaveJob}
    >
      <Bookmark className="h-5 w-5" />
    </Button>
  );
};

export default SaveJobButton;
