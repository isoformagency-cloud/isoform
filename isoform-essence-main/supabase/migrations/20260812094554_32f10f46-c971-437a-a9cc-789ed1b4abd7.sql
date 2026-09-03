CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  challenge text NOT NULL DEFAULT '',
  approach text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  services text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  hero_image text,
  images text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  live_url text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published projects are viewable by everyone" ON public.projects
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX projects_published_order_idx ON public.projects (published, display_order);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Project media is readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');
CREATE POLICY "Admins can upload project media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'project-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-media' AND public.has_role(auth.uid(), 'admin'));