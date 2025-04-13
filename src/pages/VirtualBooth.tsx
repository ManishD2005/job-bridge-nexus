
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import VirtualBoothQueue from "@/components/VirtualBooth/VirtualBoothQueue";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VirtualBooth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access the virtual booth");
      navigate("/auth", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-muted py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Virtual Booth</h1>
            <p className="text-muted-foreground text-lg">
              Join a queue to connect with recruiters via Google Meet
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <VirtualBoothQueue />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VirtualBooth;
