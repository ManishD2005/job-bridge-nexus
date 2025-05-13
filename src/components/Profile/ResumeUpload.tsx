
import { useState } from "react";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile, deleteFile, getPathFromUrl } from "@/utils/fileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResumeUploadProps {
  currentResumeUrl: string | null;
  onUploadComplete: (url: string | null) => void;
}

const ResumeUpload = ({ currentResumeUrl, onUploadComplete }: ResumeUploadProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);

  // Get the file name from the URL when component mounts
  useState(() => {
    if (currentResumeUrl) {
      const pathParts = getPathFromUrl(currentResumeUrl)?.split('/');
      if (pathParts && pathParts.length > 1) {
        setResumeName(pathParts[pathParts.length - 1]);
      }
    }
  });

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload a resume");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      // Simulate upload progress (actual progress can't be tracked in Supabase directly)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 10;
          return next > 90 ? 90 : next;
        });
      }, 300);

      // Delete existing resume if there is one
      if (currentResumeUrl) {
        const path = getPathFromUrl(currentResumeUrl);
        if (path) {
          await deleteFile('resumes', path);
        }
      }

      // Upload new resume
      const url = await uploadFile(file, 'resumes', user.id);
      
      // Update the profile with the new resume URL
      if (url) {
        const { error } = await supabase
          .from('profiles')
          .update({ resume_url: url })
          .eq('id', user.id);

        if (error) {
          throw error;
        }

        setResumeName(file.name);
        onUploadComplete(url);
        toast.success("Resume uploaded successfully");
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentResumeUrl || !user) return;

    try {
      setIsUploading(true);
      
      const path = getPathFromUrl(currentResumeUrl);
      if (path) {
        await deleteFile('resumes', path);
      }

      // Update profile to remove resume URL
      const { error } = await supabase
        .from('profiles')
        .update({ resume_url: null })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setResumeName(null);
      onUploadComplete(null);
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {!currentResumeUrl ? (
        <div 
          className={`border ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'} rounded-lg p-8 text-center transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="mb-2">Drag and drop your resume here, or click to browse</p>
          <p className="text-sm text-muted-foreground mb-4">PDF, DOC or DOCX up to 10MB</p>
          <label>
            <Button 
              variant="outline" 
              disabled={isUploading}
              className="cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Uploading...
                </>
              ) : (
                "Upload Resume"
              )}
            </Button>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium truncate max-w-[200px]">{resumeName || "Resume"}</p>
                <p className="text-sm text-muted-foreground">Uploaded successfully</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 text-destructive"
                onClick={handleDelete}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
              <a 
                href={currentResumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  View
                </Button>
              </a>
              <label>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  Replace
                </Button>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="mt-2" />
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
