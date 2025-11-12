import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mic, Upload, FileText, Globe, Play, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agentName, setAgentName] = useState("");
  const [voice, setVoice] = useState("");
  const [language, setLanguage] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [exitMessage, setExitMessage] = useState("");

  const handleSave = () => {
    if (!agentName || !voice || !language) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Agent Created!",
      description: `${agentName} has been created successfully`,
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Create Agent</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Test Agent
            </Button>
            <Button className="bg-gradient-hero hover:opacity-90 transition-smooth gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save Agent
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Basic Configuration */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Basic Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-name">Agent Name *</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g., Customer Support Agent"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voice">Voice Type *</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                      <SelectItem value="echo">Echo (Male)</SelectItem>
                      <SelectItem value="fable">Fable (British Male)</SelectItem>
                      <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
                      <SelectItem value="nova">Nova (Female)</SelectItem>
                      <SelectItem value="shimmer">Shimmer (Warm Female)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                      <SelectItem value="fr-FR">French (France)</SelectItem>
                      <SelectItem value="de-DE">German (Germany)</SelectItem>
                      <SelectItem value="it-IT">Italian (Italy)</SelectItem>
                      <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                      <SelectItem value="ko-KR">Korean</SelectItem>
                      <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Messages</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="welcome">Welcome Message</Label>
                <Textarea
                  id="welcome"
                  placeholder="Hello! I'm your AI assistant. How can I help you today?"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="mt-1.5 min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  This message will be played when the conversation starts
                </p>
              </div>

              <div>
                <Label htmlFor="exit">Exit Message</Label>
                <Textarea
                  id="exit"
                  placeholder="Thank you for contacting us. Have a great day!"
                  value={exitMessage}
                  onChange={(e) => setExitMessage(e.target.value)}
                  className="mt-1.5 min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  This message will be played when the conversation ends
                </p>
              </div>
            </div>
          </Card>

          {/* Knowledge Base */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Knowledge Base</h2>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="web">Web Form</TabsTrigger>
                <TabsTrigger value="url">URL Scraping</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-smooth cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop files or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOCX, TXT, CSV, and Excel files
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="web" className="mt-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Add Knowledge via Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter information directly through our web interface
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      className="mt-1.5"
                    />
                    <p className="text-sm text-muted-foreground mt-1.5">
                      We'll scrape and index the content from this URL
                    </p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Globe className="h-4 w-4" />
                    Scrape Website
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Advanced Settings Preview */}
          <Card className="p-6 border-primary/30">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Advanced Settings</h2>
                <p className="text-muted-foreground">
                  Configure custom actions, integrations, and workflows
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateAgent;
