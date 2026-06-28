-- ============================================================================
-- SchoolTopManager ERP - Core Schema Migration
-- Multi-tenant school management platform for African educational institutions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ESTABLISHMENTS TABLE (created first, no FK dependencies)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sigle text,
  slogan text,
  code text UNIQUE NOT NULL,
  authorization_number text,
  ministry text,
  inspection text,
  country text NOT NULL DEFAULT 'Côte d''Ivoire',
  city text,
  commune text,
  quartier text,
  address text,
  phone_primary text,
  phone_secondary text,
  email text,
  website text,
  gps_coordinates text,
  logo_url text,
  secondary_logo_url text,
  stamp_url text,
  director_signature_url text,
  manager_signature_url text,
  header_config jsonb DEFAULT '{"republic_position": "left", "logo_position": "right", "info_position": "center"}'::jsonb,
  republic_name text DEFAULT 'Côte d''Ivoire',
  republic_motto text DEFAULT 'Union - Discipline - Travail',
  settings jsonb DEFAULT '{}'::jsonb,
  matricule_format text DEFAULT '{YEAR}{SEQ:4}',
  matricule_sequence integer DEFAULT 0,
  pedagogy_system text DEFAULT 'trimestrial',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_establishments_code ON public.establishments(code);
CREATE INDEX IF NOT EXISTS idx_establishments_country ON public.establishments(country);

-- ============================================================================
-- 2. PROFILES TABLE (created second, needed by RLS functions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'TEACHER'
    CHECK (role IN ('SUPER_ADMIN', 'DIRECTOR', 'TEACHER', 'ACCOUNTANT', 'SUPERVISOR', 'SECRETARY', 'PARENT', 'STUDENT')),
  establishment_id uuid REFERENCES public.establishments(id) ON DELETE SET NULL,
  phone text,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_establishment ON public.profiles(establishment_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(is_active) WHERE is_active = true;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS (now that profiles table exists)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'SUPER_ADMIN' AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_establishment_member(user_id uuid, est_id uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND establishment_id = est_id AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_establishment_director(user_id uuid, est_id uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND establishment_id = est_id
      AND role IN ('DIRECTOR', 'SUPER_ADMIN')
      AND is_active = true
  );
$$;

-- ============================================================================
-- RLS ON ESTABLISHMENTS
-- ============================================================================
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY establishments_super_admin_all
  ON public.establishments
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY establishments_member_read
  ON public.establishments
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), id));

-- ============================================================================
-- RLS ON PROFILES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_own_read
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_own_update
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY profiles_super_admin_all
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY profiles_director_read_establishment
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    establishment_id IS NOT NULL
    AND public.is_establishment_director(auth.uid(), establishment_id)
  );

CREATE POLICY profiles_director_insert_establishment
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    establishment_id IS NOT NULL
    AND public.is_establishment_director(auth.uid(), establishment_id)
  );

CREATE POLICY profiles_director_update_establishment
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    establishment_id IS NOT NULL
    AND public.is_establishment_director(auth.uid(), establishment_id)
  )
  WITH CHECK (
    establishment_id IS NOT NULL
    AND public.is_establishment_director(auth.uid(), establishment_id)
  );

-- ============================================================================
-- 3. ACADEMIC YEARS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_years_active
  ON public.academic_years(establishment_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_academic_years_establishment ON public.academic_years(establishment_id);

ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY academic_years_member_read
  ON public.academic_years
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY academic_years_director_insert
  ON public.academic_years
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY academic_years_director_update
  ON public.academic_years
  FOR UPDATE
  TO authenticated
  USING (public.is_establishment_director(auth.uid(), establishment_id))
  WITH CHECK (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY academic_years_director_delete
  ON public.academic_years
  FOR DELETE
  TO authenticated
  USING (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY academic_years_super_admin_all
  ON public.academic_years
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- ============================================================================
-- 4. LEVELS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_levels_code_establishment UNIQUE (establishment_id, code)
);

CREATE INDEX IF NOT EXISTS idx_levels_establishment ON public.levels(establishment_id);
CREATE INDEX IF NOT EXISTS idx_levels_order ON public.levels(establishment_id, order_index);

ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY levels_member_read
  ON public.levels
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY levels_director_write
  ON public.levels
  FOR ALL
  TO authenticated
  USING (public.is_establishment_director(auth.uid(), establishment_id))
  WITH CHECK (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY levels_super_admin_all
  ON public.levels
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- ============================================================================
-- 5. CLASSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  capacity integer NOT NULL DEFAULT 50,
  main_teacher_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  series text,
  room text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_classes_code_year UNIQUE (establishment_id, academic_year_id, code)
);

CREATE INDEX IF NOT EXISTS idx_classes_establishment ON public.classes(establishment_id);
CREATE INDEX IF NOT EXISTS idx_classes_level ON public.classes(level_id);
CREATE INDEX IF NOT EXISTS idx_classes_academic_year ON public.classes(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_classes_main_teacher ON public.classes(main_teacher_id);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY classes_member_read
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY classes_director_write
  ON public.classes
  FOR ALL
  TO authenticated
  USING (public.is_establishment_director(auth.uid(), establishment_id))
  WITH CHECK (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY classes_super_admin_all
  ON public.classes
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- ============================================================================
-- 6. SUBJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  default_coefficient numeric(4,2) NOT NULL DEFAULT 1.00,
  group_type text NOT NULL DEFAULT 'other'
    CHECK (group_type IN ('literature', 'sciences', 'other')),
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_subjects_code_establishment UNIQUE (establishment_id, code)
);

CREATE INDEX IF NOT EXISTS idx_subjects_establishment ON public.subjects(establishment_id);
CREATE INDEX IF NOT EXISTS idx_subjects_group ON public.subjects(group_type);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY subjects_member_read
  ON public.subjects
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY subjects_director_write
  ON public.subjects
  FOR ALL
  TO authenticated
  USING (public.is_establishment_director(auth.uid(), establishment_id))
  WITH CHECK (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY subjects_super_admin_all
  ON public.subjects
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- ============================================================================
-- 7. CLASS_SUBJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.class_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  coefficient numeric(4,2) NOT NULL DEFAULT 1.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_class_subject UNIQUE (class_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_class_subjects_class ON public.class_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_subject ON public.class_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_teacher ON public.class_subjects(teacher_id);

ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY class_subjects_member_read
  ON public.class_subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_subjects.class_id
      AND public.is_establishment_member(auth.uid(), c.establishment_id)
    )
  );

CREATE POLICY class_subjects_director_write
  ON public.class_subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_subjects.class_id
      AND public.is_establishment_director(auth.uid(), c.establishment_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_subjects.class_id
      AND public.is_establishment_director(auth.uid(), c.establishment_id)
    )
  );

-- ============================================================================
-- 8. STUDENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  matricule text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  place_of_birth text,
  nationality text DEFAULT 'Ivoirienne',
  gender text NOT NULL CHECK (gender IN ('M', 'F')),
  photo_url text,
  address text,
  phone text,
  email text,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  series text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'graduated', 'suspended', 'expelled', 'transferred')),
  is_repeating boolean NOT NULL DEFAULT false,
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  birth_certificate_url text,
  school_certificate_url text,
  conduct_grade numeric(4,2) DEFAULT 20.00,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_students_matricule_establishment UNIQUE (establishment_id, matricule)
);

CREATE INDEX IF NOT EXISTS idx_students_establishment ON public.students(establishment_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_matricule ON public.students(establishment_id, matricule);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students(last_name, first_name);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY students_member_read
  ON public.students
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY students_director_write
  ON public.students
  FOR ALL
  TO authenticated
  USING (
    public.is_establishment_director(auth.uid(), establishment_id)
    OR (
      public.get_user_role(auth.uid()) = 'SECRETARY'
      AND public.is_establishment_member(auth.uid(), establishment_id)
    )
  )
  WITH CHECK (
    public.is_establishment_director(auth.uid(), establishment_id)
    OR (
      public.get_user_role(auth.uid()) = 'SECRETARY'
      AND public.is_establishment_member(auth.uid(), establishment_id)
    )
  );

CREATE POLICY students_own_read
  ON public.students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'STUDENT'
      AND p.establishment_id = students.establishment_id
      AND p.email = students.email
    )
  );

-- ============================================================================
-- 9. PARENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  whatsapp text,
  profession text,
  address text,
  email text,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parents_establishment ON public.parents(establishment_id);
CREATE INDEX IF NOT EXISTS idx_parents_profile ON public.parents(profile_id);

ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY parents_member_read
  ON public.parents
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY parents_director_write
  ON public.parents
  FOR ALL
  TO authenticated
  USING (
    public.is_establishment_director(auth.uid(), establishment_id)
    OR (
      public.get_user_role(auth.uid()) = 'SECRETARY'
      AND public.is_establishment_member(auth.uid(), establishment_id)
    )
  )
  WITH CHECK (
    public.is_establishment_director(auth.uid(), establishment_id)
    OR (
      public.get_user_role(auth.uid()) = 'SECRETARY'
      AND public.is_establishment_member(auth.uid(), establishment_id)
    )
  );

CREATE POLICY parents_own_read
  ON public.parents
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- ============================================================================
-- 10. STUDENT_PARENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.student_parents (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'guardian'
    CHECK (relationship IN ('father', 'mother', 'guardian', 'uncle', 'aunt', 'other')),
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, parent_id)
);

CREATE INDEX IF NOT EXISTS idx_student_parents_student ON public.student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent ON public.student_parents(parent_id);

ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY student_parents_member_read
  ON public.student_parents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_parents.student_id
      AND public.is_establishment_member(auth.uid(), s.establishment_id)
    )
  );

CREATE POLICY student_parents_director_write
  ON public.student_parents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_parents.student_id
      AND public.is_establishment_director(auth.uid(), s.establishment_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_parents.student_id
      AND public.is_establishment_director(auth.uid(), s.establishment_id)
    )
  );

-- ============================================================================
-- 11. STAFF TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  employee_id text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'teacher'
    CHECK (role IN ('teacher', 'admin', 'accountant', 'supervisor', 'secretary', 'librarian', 'nurse')),
  department text,
  diploma text,
  contract_type text,
  hire_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_staff_employee_id UNIQUE (establishment_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_establishment ON public.staff(establishment_id);
CREATE INDEX IF NOT EXISTS idx_staff_profile ON public.staff(profile_id);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY staff_member_read
  ON public.staff
  FOR SELECT
  TO authenticated
  USING (public.is_establishment_member(auth.uid(), establishment_id));

CREATE POLICY staff_director_write
  ON public.staff
  FOR ALL
  TO authenticated
  USING (public.is_establishment_director(auth.uid(), establishment_id))
  WITH CHECK (public.is_establishment_director(auth.uid(), establishment_id));

CREATE POLICY staff_own_read
  ON public.staff
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- ============================================================================
-- UPDATED AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'establishments', 'profiles', 'academic_years', 'levels',
    'classes', 'subjects', 'students', 'parents', 'staff'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trigger_%s_updated_at ON public.%I;
       CREATE TRIGGER trigger_%s_updated_at
       BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();',
      t, t, t, t
    );
  END LOOP;
END;
$$;

-- ============================================================================
-- AUTO-CREATE PROFILE ON AUTH SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'TEACHER')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SEED: Default establishment
-- ============================================================================
INSERT INTO public.establishments (name, sigle, code, country, city, ministry, republic_name, republic_motto)
VALUES (
  'Ecole Internationale de Gestion et de Technologie',
  'EIGT',
  'EIGT-001',
  'Cote d''Ivoire',
  'Abidjan',
  'Ministere de l''Education Nationale',
  'Cote d''Ivoire',
  'Union - Discipline - Travail'
)
ON CONFLICT (code) DO NOTHING;
