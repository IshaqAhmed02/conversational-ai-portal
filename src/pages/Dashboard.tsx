import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Settings, BarChart3, Mic, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Agents", value: "0", icon: Mic, color: "text-primary" },
    { label: "Total Calls", value: "0", icon: Headphones, color: "text-accent" },
    { label: "Avg. Duration", value: "0m", icon: BarChart3, color: "text-muted-foreground" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">AI VoiceUp</span>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
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

        {/* Create Agent Section */}
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
      </main>
    </div>
  );
};

export default Dashboard;
