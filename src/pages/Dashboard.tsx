import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Settings, BarChart3, Mic, Headphones, LogOut, Trash2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  voice: string;
  language: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeAgents: 0,
    totalCalls: 0,
    avgDuration: 0,
  });

  useEffect(() => {
    loadAgents();
    loadStats();
  }, []);

  const loadAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading agents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: agentsData } = await supabase.from('agents').select('id');
      const { data: sessionsData } = await supabase.from('sessions').select('id, duration_seconds');

      const totalCalls = sessionsData?.length || 0;
      const avgDuration = sessionsData?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / (totalCalls || 1);

      setStats({
        activeAgents: agentsData?.length || 0,
        totalCalls,
        avgDuration: Math.round(avgDuration / 60),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDelete = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Agent deleted",
        description: "The agent has been removed successfully",
      });

      loadAgents();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Error deleting agent",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCopyEmbed = (agentId: string) => {
    const embedCode = `<!-- AI VoiceUp Widget -->
<div id="ai-voiceup-widget-${agentId}" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  <iframe 
    src="${window.location.origin}/widget/${agentId}"
    width="70"
    height="70"
    frameborder="0"
    allow="microphone"
    style="border: none; border-radius: 50%;">
  </iframe>
</div>`;
    
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied!",
      description: "Paste it into your website",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const statsDisplay = [
    { label: "Active Agents", value: stats.activeAgents.toString(), icon: Mic, color: "text-primary" },
    { label: "Total Calls", value: stats.totalCalls.toString(), icon: Headphones, color: "text-accent" },
    { label: "Avg. Duration", value: `${stats.avgDuration}m`, icon: BarChart3, color: "text-muted-foreground" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">AI VoiceUp</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statsDisplay.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-md transition-smooth">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-semibold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : agents.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Agents</h2>
              <Button 
                className="bg-gradient-hero hover:opacity-90"
                onClick={() => navigate("/create-agent")}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Agent
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="p-6 hover:shadow-md transition-smooth">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.language}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleCopyEmbed(agent.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Embed
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(agent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">Create Your First Agent</h1>
              <p className="text-lg text-muted-foreground">
                Build intelligent voice agents that understand and respond to your customers
              </p>
            </div>

            <Card className="p-12 border-dashed border-2 hover:border-primary/50 transition-smooth">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow">
                  <Plus className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No agents yet</h3>
                  <p className="text-muted-foreground">
                    Get started by creating your first AI voice agent
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-hero hover:opacity-90 transition-smooth shadow-glow"
                  onClick={() => navigate("/create-agent")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Agent
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
