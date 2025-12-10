import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff } from "lucide-react";
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
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [token, setToken] = useState("");
  const [livekitUrl, setLivekitUrl] = useState("");
  const [roomName, setRoomName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const { data, error } = await supabase.functions.invoke("livekit-token", {
        body: { agentId },
      });

      if (error) throw error;

      setToken(data.token);
      setLivekitUrl(data.livekitUrl);
      setSessionId(data.sessionId);
      setRoomName(data.roomName);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (sessionId) {
      try {
        await supabase
          .from('sessions')
          .update({ 
            status: 'ended',
            ended_at: new Date().toISOString(),
          })
          .eq('id', sessionId);
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }
    
    setIsConnected(false);
    setToken("");
    setLivekitUrl("");
    setRoomName("");
    setSessionId(null);
  };

  return (
    <div className="h-full flex flex-col">
      {isConnected && token && livekitUrl && roomName ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow">
            <Mic className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Ready to Talk?</h3>
            <p className="text-muted-foreground max-w-sm">
              Connect to start a voice conversation with your AI assistant. Speak naturally and get instant responses.
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              size="lg"
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-gradient-hero hover:opacity-90 shadow-glow"
            >
              {isConnecting ? "Connecting..." : "Connect to Agent"}
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              <span>Make sure your microphone is enabled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
