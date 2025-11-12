import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Mic, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthModal } from "@/components/widget/AuthModal";
import { VoiceChat } from "@/components/widget/VoiceChat";

const Widget = () => {
  const { agentId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          setShowAuth(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleIconClick = () => {
    setIsOpen(true);
    if (!session) {
      setShowAuth(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowAuth(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {!isOpen ? (
        <button
          onClick={handleIconClick}
          className="w-full h-full rounded-full bg-gradient-hero shadow-elegant flex items-center justify-center hover:scale-110 transition-smooth cursor-pointer"
          aria-label="Open voice chat"
        >
          <Mic className="text-white" size={28} />
        </button>
      ) : (
        <Card className="w-full h-full flex flex-col bg-background border-border shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-hero">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-white" />
              <span className="font-semibold text-white">AI Voice Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {showAuth ? (
              <AuthModal onSuccess={() => setShowAuth(false)} />
            ) : session ? (
              <VoiceChat agentId={agentId || ""} session={session} />
            ) : (
              <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Widget;
