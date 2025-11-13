-- Create agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  voice TEXT NOT NULL,
  language TEXT NOT NULL,
  welcome_message TEXT,
  exit_message TEXT,
  icon_position TEXT DEFAULT 'bottom-right',
  icon_size TEXT DEFAULT 'medium',
  icon_color TEXT DEFAULT 'primary',
  knowledge_base JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sessions table for dynamic room management
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL UNIQUE,
  end_user_id TEXT NOT NULL,
  end_user_email TEXT,
  end_user_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Agents policies: Users can only manage their own agents
CREATE POLICY "Users can view their own agents"
  ON public.agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents"
  ON public.agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents"
  ON public.agents FOR DELETE
  USING (auth.uid() = user_id);

-- Sessions policies: Users can view sessions for their agents
CREATE POLICY "Users can view sessions for their agents"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE agents.id = sessions.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update sessions for their agents"
  ON public.sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE agents.id = sessions.agent_id
      AND agents.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_agents_user_id ON public.agents(user_id);
CREATE INDEX idx_sessions_agent_id ON public.sessions(agent_id);
CREATE INDEX idx_sessions_room_name ON public.sessions(room_name);
CREATE INDEX idx_sessions_status ON public.sessions(status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();