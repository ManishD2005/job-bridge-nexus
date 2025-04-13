
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CompanyDashboardLayout from "@/components/Company/CompanyDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, parseISO } from "date-fns";
import { Search, Plus, Calendar as CalendarIcon, Clock, Users, ExternalLink, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CompanyVirtualBooths = () => {
  const { user } = useAuth();
  const [booths, setBooths] = useState<any[]>([]);
  const [participants, setParticipants] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newBoothOpen, setNewBoothOpen] = useState(false);
  const [newBooth, setNewBooth] = useState({
    title: "",
    description: "",
    meet_link: "",
    scheduled_date: new Date(),
    duration_minutes: 30,
    max_participants: 10
  });

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("company_accounts")
          .select("company_id")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        setCompanyId(data.company_id);
        fetchBooths(data.company_id);
      } catch (error: any) {
        console.error("Error fetching company ID:", error);
        toast.error("Failed to load company information");
      }
    };
    
    fetchCompanyId();
  }, [user]);

  const fetchBooths = async (companyId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("virtual_booth_sessions")
        .select("*")
        .eq("company_id", companyId)
        .order("scheduled_date", { ascending: false });
        
      if (error) throw error;
      
      setBooths(data || []);
      
      // Fetch participants for each booth
      if (data && data.length > 0) {
        const participantsMap: Record<string, any[]> = {};
        
        await Promise.all(
          data.map(async (booth) => {
            const { data: participantsData, error: participantsError } = await supabase
              .from("booth_participants")
              .select(`
                *,
                profile:profiles(id, full_name, email)
              `)
              .eq("booth_id", booth.id);
              
            if (participantsError) throw participantsError;
            
            participantsMap[booth.id] = participantsData || [];
          })
        );
        
        setParticipants(participantsMap);
      }
    } catch (error: any) {
      console.error("Error fetching virtual booths:", error);
      toast.error("Failed to load virtual booths");
    } finally {
      setLoading(false);
    }
  };

  const createBooth = async () => {
    if (!companyId) return;
    
    if (!newBooth.title || !newBooth.meet_link || !newBooth.scheduled_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("virtual_booth_sessions")
        .insert({
          company_id: companyId,
          title: newBooth.title,
          description: newBooth.description,
          meet_link: newBooth.meet_link,
          scheduled_date: newBooth.scheduled_date.toISOString(),
          duration_minutes: newBooth.duration_minutes,
          max_participants: newBooth.max_participants,
          is_active: true
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setBooths([data, ...booths]);
      setNewBoothOpen(false);
      setNewBooth({
        title: "",
        description: "",
        meet_link: "",
        scheduled_date: new Date(),
        duration_minutes: 30,
        max_participants: 10
      });
      
      toast.success("Virtual booth created successfully");
    } catch (error: any) {
      console.error("Error creating virtual booth:", error);
      toast.error("Failed to create virtual booth");
    }
  };

  const toggleBoothStatus = async (boothId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("virtual_booth_sessions")
        .update({ is_active: !currentStatus })
        .eq("id", boothId);
        
      if (error) throw error;
      
      // Update the local state
      setBooths(booths.map(booth => 
        booth.id === boothId ? { ...booth, is_active: !currentStatus } : booth
      ));
      
      toast.success(`Booth ${!currentStatus ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling booth status:", error);
      toast.error("Failed to update booth status");
    }
  };

  const deleteBooth = async (boothId: string) => {
    if (!confirm("Are you sure you want to delete this virtual booth? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("virtual_booth_sessions")
        .delete()
        .eq("id", boothId);
        
      if (error) throw error;
      
      // Update the local state
      setBooths(booths.filter(booth => booth.id !== boothId));
      
      toast.success("Virtual booth deleted successfully");
    } catch (error: any) {
      console.error("Error deleting virtual booth:", error);
      toast.error("Failed to delete virtual booth");
    }
  };

  const filteredBooths = booths.filter(booth => 
    booth.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUpcoming = (date: string) => isAfter(parseISO(date), new Date());

  if (loading) {
    return (
      <CompanyDashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Virtual Booths</h1>
            <p className="text-muted-foreground">
              Create and manage virtual recruiting booths
            </p>
          </div>
          <Dialog open={newBoothOpen} onOpenChange={setNewBoothOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Booth
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Virtual Booth</DialogTitle>
                <DialogDescription>
                  Set up a virtual booth where candidates can join and discuss opportunities with your team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium leading-none">
                    Title *
                  </label>
                  <Input
                    id="title"
                    placeholder="Engineering Team Q&A"
                    value={newBooth.title}
                    onChange={(e) => setNewBooth({ ...newBooth, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium leading-none">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Join our engineering team to learn more about our tech stack and open positions..."
                    value={newBooth.description}
                    onChange={(e) => setNewBooth({ ...newBooth, description: e.target.value })}
                    className="min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="meet_link" className="text-sm font-medium leading-none">
                    Google Meet Link *
                  </label>
                  <Input
                    id="meet_link"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={newBooth.meet_link}
                    onChange={(e) => setNewBooth({ ...newBooth, meet_link: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a Google Meet link in advance and paste it here
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Date and Time *
                    </label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={newBooth.scheduled_date}
                        onSelect={(date) => date && setNewBooth({ ...newBooth, scheduled_date: date })}
                        className="mx-auto"
                      />
                      <div className="mt-2">
                        <Input
                          type="time"
                          value={format(newBooth.scheduled_date, "HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(newBooth.scheduled_date);
                            newDate.setHours(parseInt(hours, 10));
                            newDate.setMinutes(parseInt(minutes, 10));
                            setNewBooth({ ...newBooth, scheduled_date: newDate });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="duration" className="text-sm font-medium leading-none">
                        Duration (minutes)
                      </label>
                      <Input
                        id="duration"
                        type="number"
                        min={15}
                        max={180}
                        value={newBooth.duration_minutes}
                        onChange={(e) => setNewBooth({ ...newBooth, duration_minutes: parseInt(e.target.value, 10) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="max_participants" className="text-sm font-medium leading-none">
                        Max Participants
                      </label>
                      <Input
                        id="max_participants"
                        type="number"
                        min={1}
                        max={100}
                        value={newBooth.max_participants}
                        onChange={(e) => setNewBooth({ ...newBooth, max_participants: parseInt(e.target.value, 10) })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setNewBoothOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={createBooth}>
                  Create Booth
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle>Your Virtual Booths</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search booths..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {booths.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">You haven't created any virtual booths yet.</p>
                <Button variant="link" className="mt-2" onClick={() => setNewBoothOpen(true)}>
                  Create your first virtual booth
                </Button>
              </div>
            ) : filteredBooths.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No booths match your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooths.map((booth) => (
                      <TableRow key={booth.id}>
                        <TableCell className="font-medium">
                          <div>
                            {booth.title}
                            {booth.description && (
                              <p className="text-muted-foreground text-sm truncate max-w-xs">
                                {booth.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(booth.scheduled_date), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(booth.scheduled_date), "h:mm a")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booth.duration_minutes} minutes</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {participants[booth.id]?.length || 0} / {booth.max_participants}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {isUpcoming(booth.scheduled_date) ? (
                              <Badge variant="success">Upcoming</Badge>
                            ) : (
                              <Badge variant="secondary">Past</Badge>
                            )}
                            {booth.is_active ? (
                              <Badge variant="outline" className="mt-1">Active</Badge>
                            ) : (
                              <Badge variant="destructive" className="mt-1">Inactive</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a href={booth.meet_link} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-3 w-3 mr-1" /> Open Meet
                              </Button>
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBoothStatus(booth.id, booth.is_active)}
                            >
                              {booth.is_active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteBooth(booth.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CompanyDashboardLayout>
  );
};

export default CompanyVirtualBooths;
