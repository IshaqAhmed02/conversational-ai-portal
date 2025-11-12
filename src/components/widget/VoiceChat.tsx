import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface VoiceChatProps {
  agentId: string;
  session: Session;
}

export const VoiceChat = ({ agentId, session }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize voice connection when component mounts
    // This will connect to LiveKit using the agent ID
    console.log("Voice chat initialized for agent:", agentId);
    console.log("User session:", session.user.id);
  }, [agentId, session]);

  const handleConnect = async () => {
    try {
      // Connect to LiveKit room using agentId as room ID
      // TODO: Implement LiveKit connection
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Voice agent is ready to assist you",
      });

      // Add welcome message
      setMessages([
        {
          role: "assistant",
          content: "Hello! I'm your AI voice assistant. How can I help you today?",
        },
      ]);
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to voice agent",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    // Disconnect from LiveKit room
    // TODO: Implement LiveKit disconnection
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Thank you for using our service",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement microphone mute/unmute
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center">
                <Mic className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Voice Agent Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Click connect to start your conversation
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              size="lg"
              className="bg-gradient-hero hover:opacity-90 transition-smooth gap-2"
            >
              <Phone className="h-5 w-5" />
              Connect
            </Button>
          ) : (
            <>
              <Button
                onClick={toggleMute}
                size="lg"
                variant={isMuted ? "destructive" : "outline"}
                className="gap-2"
              >
                {isMuted ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Mute
                  </>
                )}
              </Button>
              <Button
                onClick={handleDisconnect}
                size="lg"
                variant="destructive"
                className="gap-2"
              >
                <PhoneOff className="h-5 w-5" />
                Disconnect
              </Button>
            </>
          )}
        </div>

        {isConnected && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Connected to voice agent</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
