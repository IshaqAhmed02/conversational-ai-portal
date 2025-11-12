import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Zap, Globe, Shield, BarChart3, Users, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: "AI Voice Agents",
      description: "Create intelligent voice agents with natural conversation capabilities",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Support 50+ languages and regional dialects out of the box",
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Lightning-fast speech recognition and response generation",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption and GDPR compliant infrastructure",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive insights into all conversations and performance metrics",
    },
    {
      icon: Users,
      title: "Command Center",
      description: "Monitor and manage live calls with full control capabilities",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$99",
      features: ["1 Voice Agent", "1,000 calls/month", "Basic Analytics", "Email Support"],
    },
    {
      name: "Professional",
      price: "$299",
      popular: true,
      features: ["5 Voice Agents", "10,000 calls/month", "Advanced Analytics", "Priority Support", "Custom Knowledge Base"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited Agents", "Unlimited Calls", "Full Analytics Suite", "24/7 Support", "Custom Integration", "Dedicated Account Manager"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-glow">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">AI VoiceUp</span>
          </div>
          <Button 
            className="bg-gradient-hero hover:opacity-90 transition-smooth shadow-glow"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Transform Customer
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Interactions with AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Build, deploy, and manage intelligent voice agents that understand and respond to your customers naturally
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 transition-smooth shadow-glow text-lg px-8"
                onClick={() => navigate("/dashboard")}
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to create exceptional voice experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-smooth border-border/50">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 ${plan.popular ? 'border-primary shadow-glow' : 'border-border/50'} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-hero text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-hero hover:opacity-90 shadow-glow' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate("/dashboard")}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="p-12 md:p-16 text-center bg-gradient-hero border-0 shadow-glow">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Customer Experience?
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of businesses using AI VoiceUp to deliver exceptional voice interactions
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8"
                onClick={() => navigate("/dashboard")}
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Mic className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">AI VoiceUp</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AI VoiceUp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
