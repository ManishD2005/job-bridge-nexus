
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Video, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface QueueItem {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  description: string;
  meet_link: string;
  current_position: number;
  participants: number;
  wait_time: string;
}

const VirtualBoothQueue = () => {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userQueues, setUserQueues] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchQueues();
    if (user) {
      fetchUserQueues();
    }
  }, [user]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from a virtual_booth_queues table
      // For demo purposes, we'll create some sample data
      const mockQueues: QueueItem[] = [
        {
          id: "1",
          name: "TechInnovate Engineering",
          company_id: "1",
          company_name: "TechInnovate",
          description: "Discuss engineering roles with our technical team",
          meet_link: "https://meet.google.com/abc-defg-hij",
          current_position: 3,
          participants: 12,
          wait_time: "~15 min"
        },
        {
          id: "2",
          name: "Creative Digital Design",
          company_id: "2",
          company_name: "Creative Digital",
          description: "Join our design team for portfolio reviews",
          meet_link: "https://meet.google.com/klm-nopq-rst",
          current_position: 1,
          participants: 5,
          wait_time: "~5 min"
        },
        {
          id: "3",
          name: "Global Finance HR",
          company_id: "3",
          company_name: "Global Finance",
          description: "Meet with our HR team to discuss career opportunities",
          meet_link: "https://meet.google.com/uvw-xyz-123",
          current_position: 6,
          participants: 20,
          wait_time: "~30 min"
        }
      ];
      
      setQueues(mockQueues);
    } catch (error) {
      console.error("Error fetching queues:", error);
      toast.error("Failed to load virtual booth queues");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserQueues = async () => {
    try {
      // In a real implementation, this would fetch user queue memberships
      // For demo purposes, we'll set an empty array
      setUserQueues([]);
    } catch (error) {
      console.error("Error fetching user queues:", error);
    }
  };

  const joinQueue = async (queueId: string) => {
    try {
      if (!user) {
        toast.error("You must be logged in to join a queue");
        return;
      }

      // In a real implementation, this would add the user to a queue in the database
      // For demo purposes, we'll just simulate it
      setUserQueues([...userQueues, queueId]);
      toast.success("You have joined the queue");
      
      // Find the queue and get its meet link
      const queue = queues.find(q => q.id === queueId);
      if (queue) {
        // Normally we would wait until it's the user's turn
        // For demo purposes, we'll redirect immediately
        setTimeout(() => {
          toast.success("It's your turn! Redirecting to Google Meet...");
          window.open(queue.meet_link, "_blank");
        }, 3000);
      }
    } catch (error) {
      console.error("Error joining queue:", error);
      toast.error("Failed to join queue");
    }
  };

  const leaveQueue = async (queueId: string) => {
    try {
      // In a real implementation, this would remove the user from a queue
      // For demo purposes, we'll just simulate it
      setUserQueues(userQueues.filter(id => id !== queueId));
      toast.success("You have left the queue");
    } catch (error) {
      console.error("Error leaving queue:", error);
      toast.error("Failed to leave queue");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Virtual Booths</h2>
        <p className="text-muted-foreground mb-6">
          Join a queue to connect with recruiters and company representatives through Google Meet. 
          When it's your turn, you'll be redirected to the meeting link.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queues.map((queue) => (
            <Card key={queue.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{queue.name}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {queue.company_name}
                  </Badge>
                </div>
                <CardDescription>{queue.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{queue.participants} participants in queue</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Estimated wait: {queue.wait_time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Google Meet session</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {userQueues.includes(queue.id) ? (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => leaveQueue(queue.id)}
                  >
                    Leave Queue
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => joinQueue(queue.id)}
                  >
                    Join Queue
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {userQueues.length > 0 && (
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-4">My Active Queues</h3>
          <p className="mb-4">
            You are currently in {userQueues.length} queue(s). When it's your turn, you'll be redirected to the Google Meet link.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Status
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualBoothQueue;
