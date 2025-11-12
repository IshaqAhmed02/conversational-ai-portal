import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  onSuccess: () => void;
}

export const AuthModal = ({ onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [authType, setAuthType] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      if (authType === "email") {
        if (!email.trim() || !email.includes("@")) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        toast({
          title: "OTP Sent",
          description: "Check your email for the verification code",
        });
      } else {
        if (!phone.trim() || phone.length < 10) {
          toast({
            title: "Invalid Phone",
            description: "Please enter a valid phone number",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });

        if (error) throw error;

        toast({
          title: "OTP Sent",
          description: "Check your phone for the verification code",
        });
      }

      setStep("verify");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      if (!otp.trim() || otp.length < 6) {
        toast({
          title: "Invalid OTP",
          description: "Please enter the complete verification code",
          variant: "destructive",
        });
        return;
      }

      const verifyParams = authType === "email"
        ? { email, token: otp, type: "email" as const }
        : { phone, token: otp, type: "sms" as const };

      const { error } = await supabase.auth.verifyOtp(verifyParams);

      if (error) throw error;

      toast({
        title: "Verified!",
        description: "Connecting to voice agent...",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Welcome</h2>
          <p className="text-sm text-muted-foreground">
            {step === "input"
              ? "Verify your identity to start the conversation"
              : "Enter the verification code we sent you"}
          </p>
        </div>

        {step === "input" ? (
          <Tabs value={authType} onValueChange={(v) => setAuthType(v as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                />
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-gradient-hero hover:opacity-90 transition-smooth"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-gradient-hero hover:opacity-90 transition-smooth"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1.5 text-center text-2xl tracking-widest"
                maxLength={6}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-hero hover:opacity-90 transition-smooth"
              >
                {loading ? "Verifying..." : "Verify & Connect"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("input");
                  setOtp("");
                }}
                disabled={loading}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
