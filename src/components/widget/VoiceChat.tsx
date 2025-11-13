import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

interface VoiceChatProps {
  agentId: string;
  session: Session;
}

const VoiceChatContent = ({ onDisconnect }: { onDisconnect: () => void }) => {
  const [isMuted, setIsMuted] = useState(false);
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Microphone, Track.Source.ScreenShare]);
  const { toast } = useToast();

  const toggleMute = async () => {
    if (localParticipant) {
      const newMutedState = !isMuted;
      await localParticipant.setMicrophoneEnabled(!newMutedState);
      setIsMuted(newMutedState);
      toast({
        title: newMutedState ? "Microphone Muted" : "Microphone Unmuted",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <RoomAudioRenderer />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-center h-full text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center">
              <Mic className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Voice Agent Connected</h3>
              <p className="text-sm text-muted-foreground">
                Speak naturally to interact with the AI assistant
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                Active participants: {tracks.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-center gap-4">
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
            onClick={onDisconnect}
            size="lg"
            variant="destructive"
            className="gap-2"
          >
            <PhoneOff className="h-5 w-5" />
            Disconnect
          </Button>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Connected to voice agent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VoiceChat = ({ agentId, session }: VoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string>("");
  const [livekitUrl, setLivekitUrl] = useState<string>("");
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      console.log("Connecting to LiveKit for agent:", agentId);
      
      const { data, error } = await supabase.functions.invoke('livekit-token', {
        body: { agentId }
      });

      if (error) throw error;

      if (!data.token) {
        throw new Error('Failed to get LiveKit token');
      }

      const url = import.meta.env.VITE_LIVEKIT_URL || await getConfiguredLivekitUrl();
      
      setToken(data.token);
      setLivekitUrl(url);
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "Voice agent is ready to assist you",
      });
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to voice agent",
        variant: "destructive",
      });
    }
  };

  const getConfiguredLivekitUrl = async () => {
    // Fetch LiveKit URL from environment or configuration
    const { data } = await supabase.functions.invoke('get-config');
    return data?.livekitUrl || 'wss://your-livekit-server.com';
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setToken("");
    setLivekitUrl("");
    toast({
      title: "Disconnected",
      description: "Thank you for using our service",
    });
  };

  if (isConnected && token && livekitUrl) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={livekitUrl}
        connect={true}
        audio={true}
        video={false}
        onDisconnected={handleDisconnect}
      >
        <VoiceChatContent onDisconnect={handleDisconnect} />
      </LiveKitRoom>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleConnect}
            size="lg"
            className="bg-gradient-hero hover:opacity-90 transition-smooth gap-2"
          >
            <Phone className="h-5 w-5" />
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};
