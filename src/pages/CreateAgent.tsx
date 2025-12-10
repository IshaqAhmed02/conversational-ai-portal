import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Mic, Upload, FileText, Globe, Play, Save, Copy, Check, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { VoiceChat } from "@/components/widget/VoiceChat";

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [voice, setVoice] = useState("");
  const [language, setLanguage] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [exitMessage, setExitMessage] = useState("");
  const [iconPosition, setIconPosition] = useState("bottom-right");
  const [iconSize, setIconSize] = useState("medium");
  const [iconColor, setIconColor] = useState("primary");
  const [copied, setCopied] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTestAgent = () => {
    if (!agentId) {
      toast({
        title: "Save Agent First",
        description: "Please save your agent before testing",
        variant: "destructive",
      });
      return;
    }
    setIsTestOpen(true);
  };

  const handleSave = async () => {
    if (!agentName || !voice || !language) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create an agent");
      }

      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: agentName,
          voice,
          language,
          welcome_message: welcomeMessage,
          exit_message: exitMessage,
          icon_position: iconPosition,
          icon_size: iconSize,
          icon_color: iconColor,
        })
        .select()
        .single();

      if (error) throw error;

      setAgentId(data.id);

      toast({
        title: "Agent Created!",
        description: `${agentName} has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmbedCode = () => {
    if (!agentId) return "";
    
    const sizeMap = {
      small: "60",
      medium: "70",
      large: "80"
    };
    
    const positionStyles = {
      "bottom-right": "bottom: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "top-left": "top: 20px; left: 20px;"
    };

    return `<!-- AI VoiceUp Widget -->
<div id="ai-voiceup-widget-${agentId}" style="position: fixed; ${positionStyles[iconPosition as keyof typeof positionStyles]} z-index: 9999;">
  <iframe 
    src="${window.location.origin}/widget/${agentId}"
    width="${sizeMap[iconSize as keyof typeof sizeMap]}"
    height="${sizeMap[iconSize as keyof typeof sizeMap]}"
    frameborder="0"
    allow="microphone"
    style="border: none; border-radius: 50%;">
  </iframe>
</div>
<!-- End AI VoiceUp Widget -->`;
  };

  const handleCopyCode = () => {
    if (!agentId) {
      toast({
        title: "Save Agent First",
        description: "Please save your agent before copying the embed code",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    toast({
      title: "Code Copied!",
      description: "Embed code has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
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
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleTestAgent}
              disabled={!agentId}
            >
              <Play className="h-4 w-4" />
              Test Agent
            </Button>
            <Button className="bg-gradient-hero hover:opacity-90 transition-smooth gap-2" onClick={handleSave} disabled={isLoading}>
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

          {/* Embed Code Generator */}
          <Card className="p-6 bg-gradient-subtle border-accent/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Embed Code Generator</h2>
                <p className="text-sm text-muted-foreground">
                  Agent ID: <code className="text-accent font-mono">{agentId}</code>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Customization Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="position">Icon Position</Label>
                  <Select value={iconPosition} onValueChange={setIconPosition}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Icon Size</Label>
                  <Select value={iconSize} onValueChange={setIconSize}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (60px)</SelectItem>
                      <SelectItem value="medium">Medium (70px)</SelectItem>
                      <SelectItem value="large">Large (80px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Icon Theme</Label>
                  <Select value={iconColor} onValueChange={setIconColor}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary (Indigo)</SelectItem>
                      <SelectItem value="accent">Accent (Cyan)</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview */}
              <div className="border border-border rounded-lg p-4 bg-background/50">
                <Label className="text-sm font-medium mb-2 block">Preview</Label>
                <div className="relative h-32 bg-muted/30 rounded-md overflow-hidden">
                  <div 
                    className={`absolute ${
                      iconPosition === "bottom-right" ? "bottom-2 right-2" :
                      iconPosition === "bottom-left" ? "bottom-2 left-2" :
                      iconPosition === "top-right" ? "top-2 right-2" :
                      "top-2 left-2"
                    }`}
                  >
                    <div 
                      className={`rounded-full bg-gradient-hero shadow-elegant flex items-center justify-center cursor-pointer hover:scale-110 transition-smooth ${
                        iconSize === "small" ? "w-[60px] h-[60px]" :
                        iconSize === "medium" ? "w-[70px] h-[70px]" :
                        "w-[80px] h-[80px]"
                      }`}
                    >
                      <Mic className="text-white" size={iconSize === "small" ? 24 : iconSize === "medium" ? 28 : 32} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Code */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Embed Code</Label>
                <div className="relative">
                  <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    <code>{generateEmbedCode()}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 gap-2"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Copy and paste this code into your website's HTML, just before the closing &lt;/body&gt; tag
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Test Agent Dialog */}
      <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
        <DialogContent className="max-w-md h-[600px] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>Test Agent: {agentName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {agentId && session && (
              <VoiceChat agentId={agentId} session={session} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAgent;
